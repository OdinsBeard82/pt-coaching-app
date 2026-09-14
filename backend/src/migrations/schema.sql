-- PT Coaching App schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('coach', 'client')),
  stripe_customer_id TEXT,
  current_program_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  -- content holds the structured plan:
  -- { "weeks": [ { "label": "Week 1", "days": [ { "label": "Leg Day", "exercises": [ { "name": "Goblet Squat", "sets": 4, "reps": "10-12", "notes": "" } ] } ] } ] }
  content JSONB NOT NULL DEFAULT '{"weeks": []}',
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users
  ADD CONSTRAINT fk_current_program
  FOREIGN KEY (current_program_id) REFERENCES programs(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'incomplete',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS checkins (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weight_kg NUMERIC,
  measurements JSONB DEFAULT '{}',   -- e.g. { "waist_cm": 80, "chest_cm": 100 }
  photo_urls JSONB DEFAULT '[]',
  notes TEXT,
  coach_feedback TEXT,
  coach_feedback_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_checkins_user ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
