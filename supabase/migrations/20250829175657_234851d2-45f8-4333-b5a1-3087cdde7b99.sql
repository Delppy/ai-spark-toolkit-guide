-- Remove the overly permissive policy that exposes all user data
DROP POLICY IF EXISTS "Users can view other profiles limited fields" ON public.profiles;

-- Ensure users can only view their own profile (keep existing policy)
-- The "Users can view own profile" policy already exists and is correct

-- Create a function to get public profile data (only non-sensitive fields)
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  bio TEXT,
  photo_url TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.bio,
    p.photo_url,
    p.country,
    p.created_at
  FROM public.profiles p
  WHERE p.id = profile_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_profile(UUID) TO authenticated;

-- Add a comment explaining the security model
COMMENT ON FUNCTION public.get_public_profile IS 'Returns only public, non-sensitive fields from a user profile. Used when displaying other users profiles to prevent email and personal data exposure.';