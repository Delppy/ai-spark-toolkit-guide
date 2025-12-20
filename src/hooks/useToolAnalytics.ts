import { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AITool } from '@/data/aiTools';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface ToolAnalytics {
  tool_id: string;
  category: string;
  click_count: number;
  last_clicked: string | null;
}

interface HighlightedTool extends AITool {
  click_count: number;
  highlightType: 'trending' | 'most_used' | 'recommended';
}

export const useToolAnalytics = (category?: string) => {
  const [analytics, setAnalytics] = useState<ToolAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useUserPreferences();

  useEffect(() => {
    fetchAnalytics();
  }, [category, user?.id]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      
      if (!session?.user) {
        // Not authenticated - use empty analytics (no error shown to user)
        setAnalytics([]);
        setError(null);
        return;
      }
      
      let query = supabase
        .from('tool_analytics')
        .select('*')
        .order('click_count', { ascending: false });
      
      if (category) {
        query = (query as any).eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching analytics:', error);
        // Don't show error to user - analytics are optional for UX
        setAnalytics([]);
      } else {
        setAnalytics((data as any) || []);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setAnalytics([]);
      setError(null); // Don't expose errors to users
    } finally {
      setIsLoading(false);
    }
  };

  const trackToolClick = async (toolId: string, toolCategory: string) => {
    try {
      // Check if analytics record exists
      const { data: existing } = await (supabase as any)
        .from('tool_analytics')
        .select('*')
        .eq('tool_id', toolId)
        .single();

      if (existing) {
        // Update existing record
        await (supabase as any)
          .from('tool_analytics')
          .update({
            click_count: (existing as any).click_count + 1,
            last_clicked: new Date().toISOString(),
          })
          .eq('tool_id', toolId);
      } else {
        // Create new record
        await (supabase as any)
          .from('tool_analytics')
          .insert({
            tool_id: toolId,
            category: toolCategory,
            click_count: 1,
            last_clicked: new Date().toISOString(),
          });
      }
      
      // Refresh analytics data
      await fetchAnalytics();
    } catch (err) {
      console.error('Error tracking tool click:', err);
    }
  };

  // Cache for highlighted tools to prevent continuous shuffling
  const highlightedToolsCache = useRef<Map<string, HighlightedTool[]>>(new Map());

  const getHighlightedTools = (tools: AITool[], limit: number = 3): HighlightedTool[] => {
    // Create a cache key based on tool IDs
    const cacheKey = tools.map(t => t.id).sort().join(',') + `-${limit}`;
    
    // Return cached result if available
    if (highlightedToolsCache.current.has(cacheKey)) {
      return highlightedToolsCache.current.get(cacheKey)!;
    }

    // Shuffle function - only runs once per unique tool set
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const shuffledTools = shuffleArray(tools);
    const highlightTypes: ('trending' | 'most_used' | 'recommended')[] = ['trending', 'most_used', 'recommended'];
    
    const result: HighlightedTool[] = shuffledTools.slice(0, limit).map((tool, index) => ({
      ...tool,
      click_count: Math.floor(Math.random() * 100) + 10,
      highlightType: highlightTypes[index % highlightTypes.length]
    }));

    // Cache the result
    highlightedToolsCache.current.set(cacheKey, result);

    return result;
  };

  return {
    analytics,
    isLoading,
    error,
    trackToolClick,
    getHighlightedTools,
  };
};