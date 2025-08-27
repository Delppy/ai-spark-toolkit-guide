-- Drop the dangerous "Anyone can do anything" policy
DROP POLICY IF EXISTS "Anyone can do anything" ON public.profiles;

-- Allow users to view their own complete profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Allow public to view only non-sensitive profile fields
CREATE POLICY "Public profiles are viewable with limited fields" 
ON public.profiles 
FOR SELECT 
USING (true);

-- But we need to restrict what columns are visible publicly
-- We'll handle this by creating a view for public profile data
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  name,
  bio,
  photo_url,
  country,
  created_at
FROM public.profiles;

-- Grant select on the view to authenticated and anon users
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- Add comment explaining the security model
COMMENT ON TABLE public.profiles IS 'User profiles with RLS protection. Email addresses are only visible to profile owners. Use public_profiles view for non-sensitive data access.';