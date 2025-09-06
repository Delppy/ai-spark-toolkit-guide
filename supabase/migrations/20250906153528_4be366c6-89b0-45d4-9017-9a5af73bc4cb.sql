-- Create a single source of truth function to check if a user is PRO
CREATE OR REPLACE FUNCTION public.is_user_pro_comprehensive(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    -- Check active subscriptions
    SELECT 1 
    FROM public.subscriptions 
    WHERE user_id = user_uuid 
    AND status = 'active'
    AND (next_payment_date IS NULL OR next_payment_date > now())
  )
  OR EXISTS (
    -- Check profiles for pro/lifetime/trial_pro plans
    SELECT 1
    FROM public.profiles
    WHERE id = user_uuid
    AND settings->>'plan' IN ('pro', 'lifetime', 'trial_pro')
  );
$$;

-- Create an RPC function for frontend to check PRO status
CREATE OR REPLACE FUNCTION public.rpc_is_user_pro()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER  
SET search_path = 'public'
AS $$
  SELECT public.is_user_pro_comprehensive(auth.uid());
$$;