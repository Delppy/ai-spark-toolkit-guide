
import { useState, useEffect } from 'react';
import { dataManager } from '@/data/dataManager';
import { AITool } from '@/data/aiTools';

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
  rotation_period: string;
}

// Define rotation periods (5 hours in milliseconds)
const ROTATION_INTERVAL = 5 * 60 * 60 * 1000; // 5 hours

// Curated list of popular, working AI tools with their simulated metrics
const trendingToolsPool = [
  { toolId: 'chatgpt', searchVolume: 50000000, trendScore: 100 },
  { toolId: 'perplexity', searchVolume: 8500000, trendScore: 95 },
  { toolId: 'claude-ai', searchVolume: 12000000, trendScore: 92 },
  { toolId: 'midjourney', searchVolume: 15000000, trendScore: 90 },
  { toolId: 'dalle3', searchVolume: 10000000, trendScore: 88 },
  { toolId: 'gemini', searchVolume: 9000000, trendScore: 85 },
  { toolId: 'leonardo-ai', searchVolume: 7500000, trendScore: 82 },
  { toolId: 'copilot', searchVolume: 11000000, trendScore: 87 },
  { toolId: 'runway', searchVolume: 6000000, trendScore: 80 },
  { toolId: 'elevenlabs', searchVolume: 5500000, trendScore: 78 },
  { toolId: 'synthesia', searchVolume: 4800000, trendScore: 75 },
  { toolId: 'heygen', searchVolume: 4500000, trendScore: 73 },
  { toolId: 'descript', searchVolume: 4200000, trendScore: 70 },
  { toolId: 'jasper-ai', searchVolume: 6800000, trendScore: 77 },
  { toolId: 'writesonic', searchVolume: 3800000, trendScore: 68 }
];

export const useTrendingTools = () => {
  const [trendingTools, setTrendingTools] = useState<TrendingTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingTools = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Calculate which set of tools to show based on current time
        const now = Date.now();
        const rotationIndex = Math.floor(now / ROTATION_INTERVAL);
        
        // Get all available tools
        const allTools = dataManager.getAllAITools();
        
        // Create a map for quick lookup
        const toolsMap = new Map<string, AITool>();
        allTools.forEach(tool => {
          toolsMap.set(tool.id, tool);
        });

        // Select 3 tools based on rotation
        const startIndex = (rotationIndex * 3) % trendingToolsPool.length;
        const selectedTools: TrendingTool[] = [];
        
        for (let i = 0; i < 3; i++) {
          const poolIndex = (startIndex + i) % trendingToolsPool.length;
          const poolItem = trendingToolsPool[poolIndex];
          const tool = toolsMap.get(poolItem.toolId);
          
          if (tool) {
            selectedTools.push({
              id: tool.id,
              name: tool.name,
              category: tool.category,
              description: tool.description,
              url: tool.url,
              rating: tool.rating,
              users: tool.users,
              is_pro: tool.isPro,
              search_volume: poolItem.searchVolume,
              trend_score: poolItem.trendScore,
              rotation_period: new Date(rotationIndex * ROTATION_INTERVAL).toISOString()
            });
          }
        }

        // If we don't have enough tools from our pool, add some fallbacks
        if (selectedTools.length < 3) {
          const fallbackTools = allTools
            .filter(tool => !selectedTools.find(t => t.id === tool.id))
            .slice(0, 3 - selectedTools.length)
            .map((tool, index) => ({
              id: tool.id,
              name: tool.name,
              category: tool.category,
              description: tool.description,
              url: tool.url,
              rating: tool.rating,
              users: tool.users,
              is_pro: tool.isPro,
              search_volume: Math.floor(Math.random() * 5000000) + 1000000,
              trend_score: 70 - (index * 5),
              rotation_period: new Date(rotationIndex * ROTATION_INTERVAL).toISOString()
            }));
          
          selectedTools.push(...fallbackTools);
        }

        // Sort by trend score
        selectedTools.sort((a, b) => b.trend_score - a.trend_score);
        
        console.log('Rotating trending tools - Period:', rotationIndex, 'Tools:', selectedTools.map(t => t.name));
        setTrendingTools(selectedTools);
      } catch (err) {
        console.error('Error loading trending tools:', err);
        setError('Failed to load trending tools');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchTrendingTools();

    // Set up interval to refresh every hour (to check for rotation)
    const interval = setInterval(fetchTrendingTools, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
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
