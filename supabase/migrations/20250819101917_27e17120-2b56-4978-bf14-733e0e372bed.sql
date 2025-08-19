-- Create table to track tool clicks and usage
CREATE TABLE public.tool_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id TEXT NOT NULL,
  category TEXT NOT NULL,
  click_count INTEGER NOT NULL DEFAULT 0,
  last_clicked TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_tool_analytics_tool_id ON public.tool_analytics(tool_id);
CREATE INDEX idx_tool_analytics_category ON public.tool_analytics(category);
CREATE INDEX idx_tool_analytics_click_count ON public.tool_analytics(click_count DESC);

-- Enable Row Level Security
ALTER TABLE public.tool_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (analytics are public data)
CREATE POLICY "Anyone can view tool analytics" 
ON public.tool_analytics 
FOR SELECT 
USING (true);

-- Only allow the system to insert/update analytics data
CREATE POLICY "System can insert analytics" 
ON public.tool_analytics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update analytics" 
ON public.tool_analytics 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_tool_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tool_analytics_updated_at
BEFORE UPDATE ON public.tool_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_tool_analytics_updated_at();