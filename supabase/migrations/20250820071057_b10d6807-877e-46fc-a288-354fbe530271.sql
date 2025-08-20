-- Update subscribers table to match unified billing requirements
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none' 
  CHECK (subscription_status IN ('trial', 'active', 'past_due', 'expired', 'lifetime', 'none'));

ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'none'
  CHECK (subscription_tier IN ('monthly', 'annual', 'lifetime', 'none'));

ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS premium_badge BOOLEAN DEFAULT false;

ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ;

ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS provider_customer_id TEXT;

ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS last_payment_ref TEXT;

-- Create webhook events table for idempotency and audit
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_event_id TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create billing reminders table
CREATE TABLE IF NOT EXISTS public.billing_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  reminder_type TEXT NOT NULL, -- 'renewal_3d', 'renewal_1d', 'renewal_today', 'payment_failed'
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies for webhook_events (service role only)
CREATE POLICY "service_role_only_webhook_events" ON public.webhook_events
  USING (false);

-- RLS policies for billing_reminders
CREATE POLICY "users_view_own_reminders" ON public.billing_reminders
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "service_role_manage_reminders" ON public.billing_reminders
  USING (false);