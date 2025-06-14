
-- 1. Create the 'subscribers' table to manage Pro plans, trials, etc.
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  pro_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  plan TEXT DEFAULT 'free',             -- 'free', 'pro_monthly', 'pro_annual'
  subscription_tier TEXT,               -- Optional for upgrades in future
  expires_at TIMESTAMPTZ,               -- When Pro access ends
  trial_start TIMESTAMPTZ,              -- 7-day free trial start date
  trial_expiration TIMESTAMPTZ,         -- Calculated automatically from trial_start
  trial_used BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for subscribers to only view/update their own records
CREATE POLICY "Select own subscription" ON public.subscribers
  FOR SELECT
  USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Update own subscription" ON public.subscribers
  FOR UPDATE
  USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Insert own subscription" ON public.subscribers
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR email = auth.email());
