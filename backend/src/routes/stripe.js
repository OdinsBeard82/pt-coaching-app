import { Router } from 'express';
import Stripe from 'stripe';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router();

const TIER_PRICE_IDS = {
  silver: process.env.STRIPE_PRICE_ID_SILVER,
  gold: process.env.STRIPE_PRICE_ID_GOLD,
};

// Maps a Stripe Price ID back to our tier name ('silver' | 'gold' | null).
// Used whenever we sync subscription state from Stripe, so upgrades/downgrades
// made via the billing portal are picked up automatically too.
function tierForPriceId(priceId) {
  return Object.keys(TIER_PRICE_IDS).find((tier) => TIER_PRICE_IDS[tier] === priceId) || null;
}

// Create (or reuse) a Stripe customer, then start a Checkout session for the
// chosen tier's monthly price. Called from the client's "Choose Silver/Gold" button.
router.post('/create-checkout-session', requireAuth, async (req, res) => {
  const { tier } = req.body;
  const priceId = TIER_PRICE_IDS[tier];
  if (!priceId) {
    return res.status(400).json({ error: "tier must be 'silver' or 'gold'" });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { user_id: String(user.id) },
      });
      customerId = customer.id;
      await pool.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customerId, user.id]);
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.CLIENT_URL}/subscribe?checkout=cancelled`,
      metadata: { user_id: String(user.id), tier },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not start checkout' });
  }
});

// Lets a subscribed client manage/cancel/upgrade their subscription via
// Stripe's hosted portal. To let clients switch Silver <-> Gold from the
// portal itself, enable "Customers can switch plans" in the Stripe Dashboard
// under Settings -> Billing -> Customer portal, and add both prices to the
// same product's price list there.
router.post('/create-portal-session', requireAuth, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT stripe_customer_id FROM users WHERE id = $1', [req.user.id]);
    const customerId = userResult.rows[0]?.stripe_customer_id;
    if (!customerId) return res.status(400).json({ error: 'No billing account yet' });

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/dashboard`,
    });
    res.json({ url: portal.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not open billing portal' });
  }
});

// Stripe webhook - keeps our `subscriptions` table in sync with reality.
// Mounted with express.raw() in index.js (Stripe needs the raw body to verify signatures).
export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = Number(session.metadata.user_id);
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await upsertSubscription(userId, subscription);
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = Number(customer.metadata.user_id);
        if (userId) await upsertSubscription(userId, subscription);
        break;
      }
      default:
        break; // ignore other event types
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handling error:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function upsertSubscription(userId, subscription) {
  const periodEndTimestamp =
    subscription.items?.data?.[0]?.current_period_end ?? subscription.current_period_end;
  const periodEnd = periodEndTimestamp ? new Date(periodEndTimestamp * 1000) : null;
  const priceId = subscription.items.data[0]?.price?.id;
  const tier = tierForPriceId(priceId);
  await pool.query(
    `INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_price_id, tier, status, current_period_end)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (stripe_subscription_id)
     DO UPDATE SET stripe_price_id = $3, tier = $4, status = $5, current_period_end = $6, updated_at = now()`,
    [userId, subscription.id, priceId, tier, subscription.status, periodEnd]
  );
}

export default router;