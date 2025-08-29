-- First, let's drop all existing policies on tool_analytics
DROP POLICY IF EXISTS "Anyone can view tool analytics" ON public.tool_analytics;
DROP POLICY IF EXISTS "Authenticated users can view tool analytics" ON public.tool_analytics;

-- Now add the secure policy for authenticated users only
CREATE POLICY "Authenticated users can view analytics" 
ON public.tool_analytics 
FOR SELECT 
TO authenticated
USING (true);

-- Keep the existing insert and update policies as they are
-- They allow the system to track analytics even for anonymous users