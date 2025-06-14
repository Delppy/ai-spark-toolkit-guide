
-- Create table for trending AI tools
CREATE TABLE IF NOT EXISTS public.trending_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5,
  users TEXT DEFAULT '1M+',
  is_pro BOOLEAN DEFAULT false,
  search_volume INTEGER DEFAULT 0,
  trend_score INTEGER DEFAULT 0,
  week_start DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_trending_tools_week ON public.trending_tools(week_start DESC);
CREATE INDEX IF NOT EXISTS idx_trending_tools_score ON public.trending_tools(trend_score DESC);

-- Enable RLS
ALTER TABLE public.trending_tools ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to trending tools" ON public.trending_tools
  FOR SELECT USING (true);

-- Create policy to allow service role to insert/update
CREATE POLICY "Allow service role to manage trending tools" ON public.trending_tools
  FOR ALL USING (auth.role() = 'service_role');
