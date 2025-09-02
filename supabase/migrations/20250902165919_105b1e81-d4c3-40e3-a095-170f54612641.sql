-- Remove the get_public_profile function as it bypasses RLS and creates a security vulnerability
-- This function was exposing user profile data without proper access controls
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);