import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AITool } from '@/data/aiTools';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [category, isAuthenticated]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated before fetching analytics
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
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

  const getHighlightedTools = (tools: AITool[], limit: number = 3): HighlightedTool[] => {
    const analyticsMap = analytics.reduce((acc, item) => {
      acc[item.tool_id] = item.click_count;
      return acc;
    }, {} as Record<string, number>);

    // Get tools with analytics data and sort by click count
    const toolsWithAnalytics = tools
      .map(tool => ({
        ...tool,
        click_count: analyticsMap[tool.id] || 0,
        highlightType: 'most_used' as const
      }))
      .sort((a, b) => b.click_count - a.click_count);

    // Get trending tools (tools clicked in the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const trendingTools = analytics
      .filter(item => item.last_clicked && new Date(item.last_clicked) > sevenDaysAgo)
      .sort((a, b) => b.click_count - a.click_count)
      .slice(0, limit);

    // Mark trending tools
    const result: HighlightedTool[] = [];
    const usedToolIds = new Set();

    // Add trending tools first
    for (const trendingAnalytics of trendingTools) {
      const tool = tools.find(t => t.id === trendingAnalytics.tool_id);
      if (tool && result.length < limit) {
        result.push({
          ...tool,
          click_count: trendingAnalytics.click_count,
          highlightType: 'trending'
        });
        usedToolIds.add(tool.id);
      }
    }

    // Fill remaining slots with most used tools
    for (const tool of toolsWithAnalytics) {
      if (result.length >= limit) break;
      if (!usedToolIds.has(tool.id)) {
        result.push(tool);
        usedToolIds.add(tool.id);
      }
    }

    // If we still need more, add recommended tools (highest rated)
    if (result.length < limit) {
      const recommendedTools = tools
        .filter(tool => !usedToolIds.has(tool.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit - result.length)
        .map(tool => ({
          ...tool,
          click_count: analyticsMap[tool.id] || 0,
          highlightType: 'recommended' as const
        }));
      
      result.push(...recommendedTools);
    }

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