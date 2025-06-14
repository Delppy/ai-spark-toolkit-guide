
-- Add `name`, `bio`, and `country` fields to public.profiles table
ALTER TABLE public.profiles
  ADD COLUMN name text,
  ADD COLUMN bio text,
  ADD COLUMN country text;
