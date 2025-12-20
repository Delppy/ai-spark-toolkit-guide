import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, TrendingUp, ThumbsUp, Award } from 'lucide-react';
import { AITool } from '@/data/aiTools';

interface HighlightedTool extends AITool {
  click_count: number;
  highlightType: 'trending' | 'most_used' | 'recommended';
}

interface HighlightsSectionProps {
  highlightedTools: HighlightedTool[];
  isLoading: boolean;
  onToolClick: (toolId: string, url: string) => void;
  onFavoriteClick: (toolId: string, e: React.MouseEvent) => void;
  isFavorite: (toolId: string) => boolean;
}

const getHighlightIcon = (type: string) => {
  switch (type) {
    case 'trending':
      return <TrendingUp className="w-4 h-4" />;
    case 'most_used':
      return <ThumbsUp className="w-4 h-4" />;
    case 'recommended':
      return <Award className="w-4 h-4" />;
    default:
      return <Star className="w-4 h-4" />;
  }
};

const getHighlightLabel = (type: string) => {
  switch (type) {
    case 'trending':
      return 'Trending Now';
    case 'most_used':
      return 'Most Used';
    case 'recommended':
      return 'Recommended';
    default:
      return 'Highlights';
  }
};

const getHighlightColor = (type: string) => {
  switch (type) {
    case 'trending':
      return 'bg-primary text-primary-foreground';
    case 'most_used':
      return 'bg-secondary text-secondary-foreground';
    case 'recommended':
      return 'bg-accent text-accent-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const HighlightsSection: React.FC<HighlightsSectionProps> = ({
  highlightedTools,
  isLoading,
  onToolClick,
  onFavoriteClick,
  isFavorite
}) => {
  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (highlightedTools.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Highlights</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {highlightedTools.map((tool) => (
          <Card 
            key={tool.id} 
            className="group hover:shadow-md transition-all duration-300 cursor-pointer border border-border hover:border-primary/20"
            onClick={() => onToolClick(tool.id, tool.url)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <Badge 
                  className={`${getHighlightColor(tool.highlightType)} flex items-center gap-1 px-2 py-1 text-xs font-medium`}
                >
                  {getHighlightIcon(tool.highlightType)}
                  {getHighlightLabel(tool.highlightType)}
                </Badge>
                
                <button
                  onClick={(e) => onFavoriteClick(tool.id, e)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  <Star 
                    className={`w-4 h-4 ${isFavorite(tool.id) ? 'fill-destructive text-destructive' : ''}`} 
                  />
                </button>
              </div>
              
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span>{tool.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{tool.users} users</span>
                </div>
                
                {tool.click_count > 0 && (
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{tool.click_count}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};