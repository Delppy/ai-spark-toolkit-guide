-- Add explicit policy to deny all anonymous access to subscriptions table
-- This prevents any potential exposure of sensitive billing information to unauthenticated users
CREATE POLICY "Deny all anonymous access to subscriptions" 
ON public.subscriptions 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);