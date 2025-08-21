-- Create the billing webhook processing function
CREATE OR REPLACE FUNCTION process_billing_webhook(
  p_event_type TEXT,
  p_customer_email TEXT,
  p_customer_id TEXT DEFAULT NULL,
  p_payment_ref TEXT DEFAULT NULL,
  p_amount INTEGER DEFAULT 0,
  p_status TEXT DEFAULT '',
  p_plan_code TEXT DEFAULT NULL,
  p_event_id TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  subscription_tier_val TEXT := 'monthly';
  subscription_status_val TEXT := 'none';
  premium_badge_val BOOLEAN := false;
  ends_at_val TIMESTAMPTZ := NULL;
BEGIN
  -- Determine subscription details based on event and plan
  IF p_event_type IN ('charge.success', 'subscription.create') AND p_status = 'success' THEN
    IF p_plan_code LIKE '%annual%' OR p_plan_code LIKE '%yearly%' THEN
      subscription_tier_val := 'annual';
      ends_at_val := now() + interval '1 year';
    ELSIF p_plan_code LIKE '%lifetime%' THEN
      subscription_tier_val := 'lifetime';
      subscription_status_val := 'lifetime';
      ends_at_val := NULL;
    ELSE
      subscription_tier_val := 'monthly';
      ends_at_val := now() + interval '1 month';
    END IF;
    
    IF subscription_tier_val != 'lifetime' THEN
      subscription_status_val := 'active';
    END IF;
    premium_badge_val := true;
    
  ELSIF p_event_type = 'invoice.payment_failed' OR p_status = 'failed' THEN
    subscription_status_val := 'past_due';
    premium_badge_val := false;
    
  ELSIF p_event_type = 'subscription.disable' THEN
    subscription_status_val := 'expired';
    premium_badge_val := false;
  END IF;

  -- Update subscriber record
  INSERT INTO public.subscribers (
    email, provider_customer_id, subscription_status, subscription_tier,
    premium_badge, subscription_started_at, subscription_ends_at, last_payment_ref,
    pro_enabled, expires_at, updated_at
  )
  VALUES (
    p_customer_email, p_customer_id, subscription_status_val, subscription_tier_val,
    premium_badge_val, now(), ends_at_val, p_payment_ref,
    premium_badge_val, ends_at_val, now()
  )
  ON CONFLICT (email)
  DO UPDATE SET
    provider_customer_id = COALESCE(EXCLUDED.provider_customer_id, subscribers.provider_customer_id),
    subscription_status = EXCLUDED.subscription_status,
    subscription_tier = EXCLUDED.subscription_tier,
    premium_badge = EXCLUDED.premium_badge,
    subscription_started_at = COALESCE(EXCLUDED.subscription_started_at, subscribers.subscription_started_at),
    subscription_ends_at = EXCLUDED.subscription_ends_at,
    last_payment_ref = COALESCE(EXCLUDED.last_payment_ref, subscribers.last_payment_ref),
    pro_enabled = EXCLUDED.pro_enabled,
    expires_at = EXCLUDED.expires_at,
    updated_at = now();
END;
$$;