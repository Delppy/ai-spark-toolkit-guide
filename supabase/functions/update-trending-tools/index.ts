
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TrendingTool {
  name: string;
  category: string;
  description: string;
  url: string;
  rating: number;
  users: string;
  is_pro: boolean;
  search_volume: number;
  trend_score: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting trending tools update...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Mock trending AI tools data (in production, this would fetch from Google Trends API)
    const mockTrendingTools: TrendingTool[] = [
      {
        name: "ChatGPT",
        category: "General AI",
        description: "The most popular AI assistant for any task",
        url: "https://chat.openai.com",
        rating: 4.8,
        users: "180M+",
        is_pro: false,
        search_volume: 50000000,
        trend_score: 100
      },
      {
        name: "Claude AI",
        category: "General AI",
        description: "Anthropic's advanced AI assistant for analysis and writing",
        url: "https://claude.ai",
        rating: 4.7,
        users: "15M+",
        is_pro: false,
        search_volume: 8500000,
        trend_score: 95
      },
      {
        name: "Midjourney",
        category: "Image Generation",
        description: "Create stunning AI-generated artwork and images",
        url: "https://midjourney.com",
        rating: 4.6,
        users: "20M+",
        is_pro: true,
        search_volume: 12000000,
        trend_score: 90
      },
      {
        name: "Gemini",
        category: "General AI",
        description: "Google's advanced AI model for multimodal tasks",
        url: "https://gemini.google.com",
        rating: 4.5,
        users: "25M+",
        is_pro: false,
        search_volume: 18000000,
        trend_score: 85
      },
      {
        name: "DALL-E 3",
        category: "Image Generation",
        description: "OpenAI's latest image generation model",
        url: "https://openai.com/dall-e-3",
        rating: 4.6,
        users: "10M+",
        is_pro: true,
        search_volume: 6500000,
        trend_score: 80
      },
      {
        name: "Perplexity AI",
        category: "Search & Research",
        description: "AI-powered search engine with real-time information",
        url: "https://perplexity.ai",
        rating: 4.4,
        users: "8M+",
        is_pro: false,
        search_volume: 4200000,
        trend_score: 75
      }
    ];

    // Get current week start (Monday)
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    console.log(`Updating trending tools for week starting: ${weekStart.toISOString()}`);

    // Delete existing data for this week
    const { error: deleteError } = await supabase
      .from('trending_tools')
      .delete()
      .eq('week_start', weekStart.toISOString().split('T')[0]);

    if (deleteError) {
      console.error('Error deleting existing trending tools:', deleteError);
    }

    // Insert new trending tools data
    const toolsToInsert = mockTrendingTools.map(tool => ({
      ...tool,
      week_start: weekStart.toISOString().split('T')[0]
    }));

    const { data, error } = await supabase
      .from('trending_tools')
      .insert(toolsToInsert);

    if (error) {
      console.error('Error inserting trending tools:', error);
      throw error;
    }

    console.log(`Successfully updated ${mockTrendingTools.length} trending tools`);

    return new Response(
      JSON.stringify({ 
        message: 'Trending tools updated successfully',
        count: mockTrendingTools.length,
        week_start: weekStart.toISOString().split('T')[0]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in update-trending-tools function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
