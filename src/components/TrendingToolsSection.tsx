
import React from 'react';
import { TrendingToolCard } from './TrendingToolCard';
import { useTrendingTools } from '@/hooks/useTrendingTools';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingUp } from 'lucide-react';

export const TrendingToolsSection: React.FC = () => {
  const { trendingTools, isLoading, error, handleToolClick } = useTrendingTools();

  const getTimeUntilNextRotation = () => {
    const ROTATION_INTERVAL = 5 * 60 * 60 * 1000; // 5 hours
    const now = Date.now();
    const currentPeriod = Math.floor(now / ROTATION_INTERVAL);
    const nextRotation = (currentPeriod + 1) * ROTATION_INTERVAL;
    const timeLeft = nextRotation - now;
    
    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-primary flex items-center justify-center">
            <TrendingUp className="w-8 h-8 mr-3 text-accent" />
            Trending AI Tools This Week
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on real-time Google search trends and user activity
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">Unable to Load Trending Tools</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold mb-4 text-primary flex items-center justify-center">
          <TrendingUp className="w-8 h-8 mr-3 text-accent" />
          Trending AI Tools This Week
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on real-time Google search trends and user activity. Updated weekly.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingTools.slice(0, 3).map((tool, index) => (
          <TrendingToolCard
            key={tool.id}
            tool={tool}
            onToolClick={handleToolClick}
            rank={index + 1}
          />
        ))}
      </div>
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          🔥 Trends rotate every 5 hours • Next update in {getTimeUntilNextRotation()}
        </p>
      </div>
    </section>
  );
};
