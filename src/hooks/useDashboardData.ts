
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { dataManager } from '@/data/dataManager';
import { AITool } from '@/data/aiTools';

interface DashboardData {
  favorites: string[];
  favoriteTools: AITool[];
  recentActivity: any[];
  usageStats: any[];
  categoryStats: any[];
  totalToolsUsed: number;
  weeklyUsage: number;
  averageRating: number;
  loading: boolean;
}

export const useDashboardData = (userId: string | null) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    favorites: [],
    favoriteTools: [],
    recentActivity: [],
    usageStats: [],
    categoryStats: [],
    totalToolsUsed: 0,
    weeklyUsage: 0,
    averageRating: 0,
    loading: true
  });

  const allTools = dataManager.getAllAITools();

  useEffect(() => {
    if (userId) {
      loadDashboardData();
    } else {
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  }, [userId]);

  const loadDashboardData = async () => {
    if (!userId) return;
    
    setDashboardData(prev => ({ ...prev, loading: true }));
    
    try {
      // Load favorites from Supabase
      const { data: favoritesData, error: favoritesError } = await (supabase as any)
        .from('favorites')
        .select('item_id')
        .eq('user_id', userId);
      
      if (favoritesError) throw favoritesError;
      
      const favoriteIds = (favoritesData as any)?.map((fav: any) => fav.item_id) || [];
      const favoriteTools = allTools.filter(tool => favoriteIds.includes(tool.id));

      // Load user reviews to calculate average rating
      const { data: reviewsData, error: reviewsError } = await (supabase as any)
        .from('reviews')
        .select('rating')
        .eq('user_id', userId);
      
      if (reviewsError) throw reviewsError;
      
      const averageRating = reviewsData && reviewsData.length > 0
        ? (reviewsData as any).reduce((sum: number, review: any) => sum + review.rating, 0) / reviewsData.length
        : 0;

      // Generate usage stats (mock data for now - replace with actual usage tracking)
      const mockUsageStats = [
        { name: 'Mon', tools: Math.floor(Math.random() * 5) },
        { name: 'Tue', tools: Math.floor(Math.random() * 5) },
        { name: 'Wed', tools: Math.floor(Math.random() * 5) },
        { name: 'Thu', tools: Math.floor(Math.random() * 5) },
        { name: 'Fri', tools: Math.floor(Math.random() * 5) },
        { name: 'Sat', tools: Math.floor(Math.random() * 5) },
        { name: 'Sun', tools: Math.floor(Math.random() * 5) },
      ];

      const weeklyUsage = mockUsageStats.reduce((sum, day) => sum + day.tools, 0);

      // Generate category stats based on user's favorites
      const categoryCount: { [key: string]: number } = {};
      favoriteTools.forEach(tool => {
        categoryCount[tool.category] = (categoryCount[tool.category] || 0) + 1;
      });

      const categoryStats = Object.keys(categoryCount).map((category, index) => ({
        name: category,
        value: Math.round((categoryCount[category] / favoriteTools.length) * 100) || 0,
        color: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'][index % 5]
      }));

      // Mock recent activity - replace with actual activity tracking
      const mockActivity = [
        { action: 'Added tool to favorites', timestamp: new Date(Date.now() - 1000 * 60 * 30), category: 'Favorites' },
        { action: 'Left a review', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), category: 'Reviews' },
        { action: 'Explored new category', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), category: 'Discovery' },
      ];

      setDashboardData({
        favorites: favoriteIds,
        favoriteTools,
        recentActivity: mockActivity,
        usageStats: mockUsageStats,
        categoryStats: categoryStats.length > 0 ? categoryStats : [
          { name: 'No data yet', value: 100, color: '#6B7280' }
        ],
        totalToolsUsed: reviewsData?.length || 0,
        weeklyUsage,
        averageRating,
        loading: false
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  return dashboardData;
};
