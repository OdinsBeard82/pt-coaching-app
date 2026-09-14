# Coaching Portal

A standalone app for selling online coaching: clients pay a monthly subscription (Stripe),
get their training program, submit weekly check-ins (weight, measurements, photos, notes),
and you review + reply as the coach.

- **Backend:** Node.js / Express / PostgreSQL / Stripe
- **Frontend:** React (Vite)
- **Model:** single coach (you) with many clients. No multi-tenant complexity.

## How it works

- Anyone can sign up as a **client**. New signups are routed to `/subscribe` until they pay.
- **You** are the one **coach** account, created via a seed script (not the public signup form).
- Client subscribes → Stripe Checkout → webhook flips their subscription to `active` → they unlock
  the dashboard.
- You build **programs** (weeks → days → exercises) in the program builder, then assign a program
  to each client from their client detail page.
- Clients submit **check-ins** (weight, waist measurement, notes, up to 6 photos). You see them in
  a feed on the coach dashboard and can leave feedback per check-in.
- Billing management (cancel, update card) is handled by Stripe's own hosted portal — no need to
  build that yourself.

## 1. Prerequisites

- Node.js 18+
- A PostgreSQL database (local, or a free one from [Neon](https://neon.tech) / [Railway](https://railway.app) / [Supabase](https://supabase.com))
- A [Stripe](https://dashboard.stripe.com) account (use **test mode** first)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

- `DATABASE_URL` — your Postgres connection string
- `JWT_SECRET` — any long random string
- `STRIPE_SECRET_KEY` — from Stripe Dashboard → Developers → API keys (use the test key `sk_test_...` first)
- `STRIPE_PRICE_ID` — create a **Product** in Stripe Dashboard → Product catalog with a **recurring
  monthly Price** (e.g. £100/month), then paste that Price's ID here (`price_...`)
- `STRIPE_WEBHOOK_SECRET` — see step 4 below
- `CLIENT_URL` — `http://localhost:5173` while developing

Run the migration to create the tables:

```bash
npm run migrate
```

Create your coach account:

```bash
node src/seed-coach.js you@email.com "a-strong-password" "Your Name"
```

Start the API:

```bash
npm run dev
```

It runs on `http://localhost:4000`.

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

It runs on `http://localhost:5173` and proxies `/api` calls to the backend automatically.

## 4. Stripe webhook (required for subscriptions to actually activate)

Stripe needs to tell your server when a payment succeeds. Easiest way while developing locally:

```bash
# in a new terminal
stripe listen --forward-to localhost:4000/api/stripe/webhook
```

(Install the Stripe CLI first: https://stripe.com/docs/stripe-cli)

This prints a `whsec_...` value — put that in your backend `.env` as `STRIPE_WEBHOOK_SECRET`
and restart the backend.

For production, add a webhook endpoint in the Stripe Dashboard pointing to
`https://your-domain.com/api/stripe/webhook`, listening for at least:
`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
Use the signing secret it gives you as `STRIPE_WEBHOOK_SECRET`.

## 5. Try it end-to-end

1. Go to `http://localhost:5173`, sign up as a client.
2. You'll land on `/subscribe` — click subscribe, use Stripe's test card `4242 4242 4242 4242`,
   any future expiry date, any CVC.
3. You're redirected back and land on your dashboard — subscription now active.
4. Log in as the coach (the account you made with `seed-coach.js`), go to `/coach`.
5. Build a program (`+ New program`), then open the client and assign it to them.
6. Log back in as the client — the program now shows on their dashboard.
7. Submit a check-in as the client, then leave feedback on it as the coach.

## 6. Deploying

- **Database:** Neon, Railway, or Supabase all have free Postgres tiers that work fine here.
- **Backend:** Render, Railway, or Fly.io. Set all the same env vars from `.env`, run
  `npm run migrate` once against the production database, then run `node src/seed-coach.js ...`
  once to create your coach login.
- **Frontend:** Vercel or Netlify (or serve `frontend/dist` from the backend if you'd rather have
  one deployment — ask me and I'll wire that up).
- **Check-in photos:** the app currently stores uploaded photos on local disk
  (`backend/uploads/`). This works fine locally but **most hosts wipe local disk on redeploy** —
  for production, swap this for S3 or Cloudinary. The upload route (`backend/src/routes/checkins.js`)
  is written so only the `storage` config needs to change, not the rest of the logic. Say the word
  and I'll wire up S3/Cloudinary directly.
- Remember to switch Stripe from test keys to live keys (`sk_live_...`) once you're ready to take
  real payments, and create a live-mode webhook endpoint too — test and live are separate.

## Notes on what's intentionally simple

- One subscription tier (matches your current £100/month offer). If you want multiple tiers later,
  it's a small change: multiple Stripe Prices + a tier column on `subscriptions`.
- No password reset flow yet — easy to add via email (Resend/Postmark) if you want it.
- No client-to-coach messaging — check-in notes + coach feedback cover the "weekly check-ins with
  feedback" part of your offer; if you want free-form async messaging too, that's a natural next
  addition.
