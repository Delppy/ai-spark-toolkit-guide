
-- Create the profiles table for your app with relevant fields.
create table public.profiles (
  id uuid not null primary key, -- references auth.users(id)
  email text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  favorites jsonb,
  prompt_usage_history jsonb,
  resources jsonb,
  settings jsonb
);

-- Add a foreign key constraint to keep auth.users and profiles linked.
alter table public.profiles
add constraint profiles_id_fkey
foreign key (id)
references auth.users(id)
on delete cascade;

-- Enable row-level security
alter table public.profiles enable row level security;

-- Allow users to select their own profile
create policy "Allow user to read their own profile"
on public.profiles
for select
using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Allow user to update their own profile"
on public.profiles
for update
using (auth.uid() = id);

-- Allow users to insert their own profile (in case of manual creation)
create policy "Allow user to insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- Allow users to delete their own profile
create policy "Allow user to delete their own profile"
on public.profiles
for delete
using (auth.uid() = id);

-- The prompt_favorites and prompt_usage_history tables from the last migration will now be able to reference profiles(id) instead of auth.users(id).

