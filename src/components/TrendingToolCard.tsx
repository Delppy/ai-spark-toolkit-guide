
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, ExternalLink, TrendingUp } from 'lucide-react';
import AnimatedCard from '@/components/ui/animated-card';

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
}

interface TrendingToolCardProps {
  tool: TrendingTool;
  onToolClick: (url: string) => void;
  rank: number;
}

export const TrendingToolCard: React.FC<TrendingToolCardProps> = ({
  tool,
  onToolClick,
  rank
}) => {
  const formatSearchVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(0)}K`;
    }
    return volume.toString();
  };

  return (
    <AnimatedCard 
      className="cursor-pointer relative overflow-hidden"
      onClick={() => onToolClick(tool.url)}
    >
      {/* Trending rank badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge 
          variant="secondary" 
          className="bg-primary text-primary-foreground font-bold text-xs px-2 py-1"
        >
          #{rank}
        </Badge>
      </div>

      {/* Trending indicator */}
      <div className="absolute top-3 right-3 z-10">
        <div className="flex items-center space-x-1 bg-muted text-foreground px-2 py-1 rounded-lg text-xs border border-border">
          <TrendingUp className="w-3 h-3" />
          <span className="font-medium">Trending</span>
        </div>
      </div>

      <CardHeader className="pb-4 pt-12">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors flex items-center">
              {tool.name}
              {tool.is_pro && (
                <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                  Pro
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {tool.category}
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                <span>{formatSearchVolume(tool.search_volume)} searches</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow">
        <CardDescription className="mb-4 text-muted-foreground">
          {tool.description}
        </CardDescription>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span>{tool.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{tool.users}</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-center p-3 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors">
            <ExternalLink className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Try Now</span>
          </div>
        </div>
      </CardContent>
    </AnimatedCard>
  );
};