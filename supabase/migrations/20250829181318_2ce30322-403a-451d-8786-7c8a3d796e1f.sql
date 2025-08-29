-- Drop the insecure "Anyone can do anything" policy
DROP POLICY IF EXISTS "Anyone can do anything" ON public.reviews;

-- Keep the public read policy (anyone can view reviews)
-- This policy already exists: "Anyone can view reviews"

-- Add secure policies for authenticated users
CREATE POLICY "Authenticated users can create their own reviews" 
ON public.reviews 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Also update the review_votes table to require authentication
DROP POLICY IF EXISTS "Anyone can do anything" ON public.review_votes;

-- Keep the public read policy for review_votes
-- This policy already exists: "Anyone can view review votes"

-- Add secure policies for review votes
CREATE POLICY "Authenticated users can vote on reviews" 
ON public.review_votes 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" 
ON public.review_votes 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON public.review_votes 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);