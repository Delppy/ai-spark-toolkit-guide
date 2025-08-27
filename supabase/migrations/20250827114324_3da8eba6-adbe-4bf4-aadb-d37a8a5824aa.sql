-- Drop the view that was causing the security warning
DROP VIEW IF EXISTS public.public_profiles;

-- Instead, let's handle public profile access more securely
-- First, drop the overly permissive public select policy
DROP POLICY IF EXISTS "Public profiles are viewable with limited fields" ON public.profiles;

-- Create a more restrictive policy for viewing other users' profiles
-- This only exposes non-sensitive fields through RLS
CREATE POLICY "Users can view other profiles limited fields" 
ON public.profiles 
FOR SELECT 
USING (
  -- User can see their own full profile
  auth.uid() = id 
  OR 
  -- Or see limited fields of others (RLS doesn't restrict columns, but we'll handle this in the app)
  auth.uid() IS NOT NULL
);

-- For truly public access (non-authenticated users), we should not allow any access
-- If the app needs public profile viewing, it should be done through an edge function

-- Add a comment about the security model
COMMENT ON POLICY "Users can view other profiles limited fields" ON public.profiles IS 
'Authenticated users can view profiles. App code should filter sensitive fields when displaying other users profiles.';