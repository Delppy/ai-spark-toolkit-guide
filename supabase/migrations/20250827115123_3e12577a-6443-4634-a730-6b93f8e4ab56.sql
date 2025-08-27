-- Drop the dangerous "Anyone can do anything" policy
DROP POLICY IF EXISTS "Anyone can do anything" ON public.favorites;

-- Allow users to view only their own favorites
CREATE POLICY "Users can view own favorites" 
ON public.favorites 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert only their own favorites
CREATE POLICY "Users can insert own favorites" 
ON public.favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own favorites
CREATE POLICY "Users can update own favorites" 
ON public.favorites 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete only their own favorites
CREATE POLICY "Users can delete own favorites" 
ON public.favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add comment explaining the security model
COMMENT ON TABLE public.favorites IS 'User favorites with RLS protection. Each user can only access and modify their own favorites. Requires authentication.';

-- Add index for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);

-- Add index for better performance on item_id lookups
CREATE INDEX IF NOT EXISTS idx_favorites_item_id ON public.favorites(item_id);