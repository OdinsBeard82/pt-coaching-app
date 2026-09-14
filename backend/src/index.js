import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.js';
import programRoutes from './routes/programs.js';
import clientRoutes from './routes/clients.js';
import checkinRoutes from './routes/checkins.js';
import stripeRoutes, { handleStripeWebhook } from './routes/stripe.js';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// Stripe webhook needs the RAW body to verify the signature, so it must be
// mounted before express.json() and given its own raw-body parser.
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/stripe', stripeRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
