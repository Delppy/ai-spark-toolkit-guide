-- Drop all payment, subscription, and credit related tables
DROP TABLE IF EXISTS webhook_events CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;
DROP TABLE IF EXISTS billing_reminders CASCADE;
DROP TABLE IF EXISTS user_plan CASCADE;
DROP TABLE IF EXISTS prompt_credits CASCADE;
DROP TABLE IF EXISTS prompt_usage CASCADE;

-- Drop RLS policies on favorites and profiles since they depend on auth
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "User can add favorite" ON favorites;
DROP POLICY IF EXISTS "User can remove favorite" ON favorites;
DROP POLICY IF EXISTS "User can view their favorites" ON favorites;
DROP POLICY IF EXISTS "Users can create their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow user to delete their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow user to insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow user to read their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow user to update their own profile" ON profiles;

ALTER TABLE review_votes DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own review votes" ON review_votes;
DROP POLICY IF EXISTS "Users can delete their own review votes" ON review_votes;
DROP POLICY IF EXISTS "Users can update their own review votes" ON review_votes;

ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;

-- Drop auth trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop billing function
DROP FUNCTION IF EXISTS public.process_billing_webhook;

-- Make favorites, profiles, and reviews public without user constraints
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;
ALTER TABLE favorites ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE reviews ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE review_votes DROP CONSTRAINT IF EXISTS review_votes_user_id_fkey;
ALTER TABLE review_votes ALTER COLUMN user_id DROP NOT NULL;

-- Create public RLS policies for everything
CREATE POLICY "Anyone can do anything" ON favorites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can do anything" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can do anything" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can do anything" ON review_votes FOR ALL USING (true) WITH CHECK (true);

-- Enable RLS back with public access
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;