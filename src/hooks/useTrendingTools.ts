
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrendingTool {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  rating: number;
  users: string;
  is_pro: boolean;
  search_volume: number;
  trend_score: number;
  week_start: string;
}

export const useTrendingTools = () => {
  const [trendingTools, setTrendingTools] = useState<TrendingTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingTools = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current week start
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1);
        weekStart.setHours(0, 0, 0, 0);

        console.log('Fetching trending tools for week:', weekStart.toISOString().split('T')[0]);

        const { data, error: fetchError } = await supabase
          .from('trending_tools')
          .select('*')
          .eq('week_start', weekStart.toISOString().split('T')[0])
          .order('trend_score', { ascending: false })
          .limit(6);

        if (fetchError) {
          console.error('Error fetching trending tools:', fetchError);
          
          // If no trending_tools table exists, provide fallback data
          if (fetchError.code === 'PGRST116' || fetchError.message?.includes('relation "public.trending_tools" does not exist')) {
            console.log('Trending tools table does not exist, using fallback data');
            setTrendingTools([
              {
                id: '1',
                name: "ChatGPT",
                category: "General AI",
                description: "The most popular AI assistant for any task",
                url: "https://chat.openai.com",
                rating: 4.8,
                users: "180M+",
                is_pro: false,
                search_volume: 50000000,
                trend_score: 100,
                week_start: weekStart.toISOString().split('T')[0]
              },
              {
                id: '2',
                name: "Claude AI",
                category: "General AI", 
                description: "Anthropic's advanced AI assistant for analysis and writing",
                url: "https://claude.ai",
                rating: 4.7,
                users: "15M+",
                is_pro: false,
                search_volume: 8500000,
                trend_score: 95,
                week_start: weekStart.toISOString().split('T')[0]
              },
              {
                id: '3',
                name: "Midjourney",
                category: "Image Generation",
                description: "Create stunning AI-generated artwork and images",
                url: "https://midjourney.com",
                rating: 4.6,
                users: "20M+",
                is_pro: true,
                search_volume: 12000000,
                trend_score: 90,
                week_start: weekStart.toISOString().split('T')[0]
              }
            ]);
          } else {
            setError('Failed to load trending tools');
          }
          return;
        }

        console.log('Fetched trending tools data:', data);

        if (data && data.length > 0) {
          setTrendingTools(data);
        } else {
          console.log('No trending tools found for current week, using fallback data');
          // Fallback to static data if no trending data is available
          setTrendingTools([
            {
              id: '1',
              name: "ChatGPT",
              category: "General AI",
              description: "The most popular AI assistant for any task",
              url: "https://chat.openai.com",
              rating: 4.8,
              users: "180M+",
              is_pro: false,
              search_volume: 50000000,
              trend_score: 100,
              week_start: weekStart.toISOString().split('T')[0]
            },
            {
              id: '2',
              name: "Claude AI",
              category: "General AI", 
              description: "Anthropic's advanced AI assistant for analysis and writing",
              url: "https://claude.ai",
              rating: 4.7,
              users: "15M+",
              is_pro: false,
              search_volume: 8500000,
              trend_score: 95,
              week_start: weekStart.toISOString().split('T')[0]
            },
            {
              id: '3',
              name: "Midjourney",
              category: "Image Generation",
              description: "Create stunning AI-generated artwork and images",
              url: "https://midjourney.com",
              rating: 4.6,
              users: "20M+",
              is_pro: true,
              search_volume: 12000000,
              trend_score: 90,
              week_start: weekStart.toISOString().split('T')[0]
            }
          ]);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingTools();
  }, []);

  const handleToolClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return {
    trendingTools,
    isLoading,
    error,
    handleToolClick
  };
};
