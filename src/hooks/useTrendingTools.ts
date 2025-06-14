
import { useState, useEffect } from 'react';

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

        console.log('Using fallback trending tools data');
        
        // Use fallback data since trending_tools table doesn't exist in current schema
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
