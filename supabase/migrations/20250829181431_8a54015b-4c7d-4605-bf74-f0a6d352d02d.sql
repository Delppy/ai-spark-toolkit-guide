-- Remove the public SELECT policy for tool_analytics
DROP POLICY IF EXISTS "Anyone can view tool analytics" ON public.tool_analytics;

-- Add a policy that only allows authenticated users to view analytics
-- This maintains functionality for logged-in users while protecting data from competitors
CREATE POLICY "Authenticated users can view tool analytics" 
ON public.tool_analytics 
FOR SELECT 
TO authenticated
USING (true);

-- Keep existing insert and update policies (they already allow public writes for tracking)
-- These are needed for anonymous users to track clicks
-- The "System can insert analytics" and "System can update analytics" policies remain unchanged