-- Add explicit policy to deny all public access to profiles table
-- This ensures no anonymous users can access profile data under any circumstances
CREATE POLICY "Deny all anonymous access to profiles" 
ON public.profiles 
FOR ALL 
TO anon 
USING (false);

-- Add explicit policy to ensure only authenticated users can access their own data
CREATE POLICY "Restrict authenticated access to own profile only" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);