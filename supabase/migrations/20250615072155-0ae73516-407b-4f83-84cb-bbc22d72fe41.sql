
-- Table: user_plan
-- Stores the user's current plan (free/pro), plan activation & trial info
CREATE TABLE public.user_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro'
  upgraded_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read their plan only"
  ON public.user_plan FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "User can upsert their plan"
  ON public.user_plan FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "User can update their plan"
  ON public.user_plan FOR UPDATE
  USING (user_id = auth.uid());

-- Table: prompt_usage
-- Tracks free user's prompt unlock/usage, by category and by month
CREATE TABLE public.prompt_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  category TEXT NOT NULL,
  prompt_count INTEGER NOT NULL DEFAULT 0,
  last_used TIMESTAMPTZ,
  -- The period key allows efficient reset (YYYY-MM), e.g. "2025-06"
  usage_period TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, category, usage_period)
);
ALTER TABLE public.prompt_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view their own usage"
  ON public.prompt_usage FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "User can increment usage"
  ON public.prompt_usage FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "User can update their own usage"
  ON public.prompt_usage FOR UPDATE
  USING (user_id = auth.uid());

-- Table: favorites
-- Store user's favorite prompts/tools, limit to 5 for free users, unlimited for Pro
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  item_id TEXT NOT NULL, -- Could be prompt id or tool id
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view their favorites"
  ON public.favorites FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "User can add favorite"
  ON public.favorites FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "User can remove favorite"
  ON public.favorites FOR DELETE
  USING (user_id = auth.uid());

-- Table: prompt_credits (optional, for credit-based usage/preview)
CREATE TABLE public.prompt_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  credit_balance INTEGER NOT NULL DEFAULT 10,
  usage_period TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, usage_period)
);
ALTER TABLE public.prompt_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can view their credits"
  ON public.prompt_credits FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "User can update credits"
  ON public.prompt_credits FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "User can insert credits"
  ON public.prompt_credits FOR INSERT WITH CHECK (user_id = auth.uid());
