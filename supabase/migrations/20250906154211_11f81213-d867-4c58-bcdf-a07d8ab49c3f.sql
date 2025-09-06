-- Create function to check if user is a PAID pro (excludes trial_pro)
CREATE OR REPLACE FUNCTION public.is_pro_paid(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    -- Check for pro or lifetime plan in profiles
    SELECT 1
    FROM public.profiles
    WHERE id = uid
    AND settings->>'plan' IN ('pro', 'lifetime')
  )
  OR EXISTS (
    -- Check for active paid subscription
    SELECT 1 
    FROM public.subscriptions 
    WHERE user_id = uid 
    AND status = 'active'
    AND plan_code NOT LIKE '%trial%'
    AND (next_payment_date IS NULL OR next_payment_date > now())
  );
$$;

-- Create RPC function for frontend to check PAID PRO status
CREATE OR REPLACE FUNCTION public.rpc_is_pro_paid()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT public.is_pro_paid(auth.uid());
$$;

-- Create table to track prompt refinery usage for free users
CREATE TABLE IF NOT EXISTS public.prompt_refinery_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  used_today integer DEFAULT 0,
  reset_at timestamp with time zone DEFAULT (date_trunc('day', now()) + interval '1 day'),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on prompt_refinery_usage
ALTER TABLE public.prompt_refinery_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for prompt_refinery_usage
CREATE POLICY "Users can view their own usage"
ON public.prompt_refinery_usage
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
ON public.prompt_refinery_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
ON public.prompt_refinery_usage
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create function to check and update prompt usage
CREATE OR REPLACE FUNCTION public.check_and_update_prompt_usage(
  user_uuid uuid,
  daily_limit integer DEFAULT 10
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  is_paid boolean;
  current_usage record;
  result json;
BEGIN
  -- Check if user is paid pro
  is_paid := public.is_pro_paid(user_uuid);
  
  -- If paid, return unlimited access
  IF is_paid THEN
    RETURN json_build_object(
      'allowed', true,
      'is_paid', true,
      'used_today', 0,
      'remaining', 999999,
      'limit', 999999
    );
  END IF;
  
  -- For free users, check usage
  -- Get or create usage record
  INSERT INTO public.prompt_refinery_usage (user_id, used_today, reset_at)
  VALUES (user_uuid, 0, date_trunc('day', now()) + interval '1 day')
  ON CONFLICT (user_id) DO UPDATE
  SET 
    used_today = CASE 
      WHEN prompt_refinery_usage.reset_at < now() 
      THEN 0 
      ELSE prompt_refinery_usage.used_today 
    END,
    reset_at = CASE 
      WHEN prompt_refinery_usage.reset_at < now() 
      THEN date_trunc('day', now()) + interval '1 day'
      ELSE prompt_refinery_usage.reset_at 
    END,
    updated_at = now()
  RETURNING * INTO current_usage;
  
  -- Check if user has reached limit
  IF current_usage.used_today >= daily_limit THEN
    RETURN json_build_object(
      'allowed', false,
      'is_paid', false,
      'used_today', current_usage.used_today,
      'remaining', 0,
      'limit', daily_limit,
      'reset_at', current_usage.reset_at
    );
  END IF;
  
  -- Increment usage
  UPDATE public.prompt_refinery_usage
  SET 
    used_today = used_today + 1,
    updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN json_build_object(
    'allowed', true,
    'is_paid', false,
    'used_today', current_usage.used_today + 1,
    'remaining', daily_limit - (current_usage.used_today + 1),
    'limit', daily_limit,
    'reset_at', current_usage.reset_at
  );
END;
$$;

-- Create RPC to check prompt usage without updating
CREATE OR REPLACE FUNCTION public.rpc_check_prompt_usage()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_uuid uuid;
  is_paid boolean;
  current_usage record;
  daily_limit integer := 10;
BEGIN
  user_uuid := auth.uid();
  
  IF user_uuid IS NULL THEN
    RETURN json_build_object(
      'allowed', false,
      'is_paid', false,
      'used_today', 0,
      'remaining', 0,
      'limit', 0,
      'error', 'Not authenticated'
    );
  END IF;
  
  -- Check if user is paid pro
  is_paid := public.is_pro_paid(user_uuid);
  
  -- If paid, return unlimited access
  IF is_paid THEN
    RETURN json_build_object(
      'allowed', true,
      'is_paid', true,
      'used_today', 0,
      'remaining', 999999,
      'limit', 999999
    );
  END IF;
  
  -- For free users, check usage
  SELECT * INTO current_usage
  FROM public.prompt_refinery_usage
  WHERE user_id = user_uuid;
  
  IF current_usage IS NULL THEN
    RETURN json_build_object(
      'allowed', true,
      'is_paid', false,
      'used_today', 0,
      'remaining', daily_limit,
      'limit', daily_limit
    );
  END IF;
  
  -- Reset if needed
  IF current_usage.reset_at < now() THEN
    RETURN json_build_object(
      'allowed', true,
      'is_paid', false,
      'used_today', 0,
      'remaining', daily_limit,
      'limit', daily_limit,
      'reset_at', date_trunc('day', now()) + interval '1 day'
    );
  END IF;
  
  RETURN json_build_object(
    'allowed', current_usage.used_today < daily_limit,
    'is_paid', false,
    'used_today', current_usage.used_today,
    'remaining', GREATEST(0, daily_limit - current_usage.used_today),
    'limit', daily_limit,
    'reset_at', current_usage.reset_at
  );
END;
$$;

-- Create RPC to use a prompt credit
CREATE OR REPLACE FUNCTION public.rpc_use_prompt_credit()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN public.check_and_update_prompt_usage(auth.uid(), 10);
END;
$$;