import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from '@/components/ui/hover-card';
import { 
  Star, 
  Users, 
  ExternalLink, 
  Heart, 
  Bookmark, 
  Gift, 
  Info,
  DollarSign
} from 'lucide-react';
import { AITool } from '@/data/aiTools';

interface ToolCardProps {
  tool: AITool;
  onFavoriteClick: (toolId: string, e: React.MouseEvent) => void;
  onToolClick: (toolId: string, url: string) => void;
  isFavorite: (toolId: string) => boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onFavoriteClick,
  onToolClick,
  isFavorite
}) => {
  const getFreeOfferingIcon = (offering: string) => {
    switch (offering) {
      case 'free':
        return <Gift className="w-3 h-3 text-green-600" />;
      case 'free_trial':
        return <Gift className="w-3 h-3 text-blue-600" />;
      case 'free_credits':
        return <Gift className="w-3 h-3 text-purple-600" />;
      case 'freemium':
        return <Gift className="w-3 h-3 text-orange-600" />;
      default:
        return null;
    }
  };

  const getFreeOfferingColor = (offering: string) => {
    switch (offering) {
      case 'free':
        return 'bg-green-100 text-green-800';
      case 'free_trial':
        return 'bg-blue-100 text-blue-800';
      case 'free_credits':
        return 'bg-purple-100 text-purple-800';
      case 'freemium':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  // Sample reviews & ratings (placeholder, can be swapped with dynamic/backend later)
  const reviews = [
    { name: "Sophia", rating: 5, comment: "Excellent tool! Saved me tons of time." },
    { name: "James", rating: 4, comment: "Helpful but takes a while to learn." },
    { name: "Aisha", rating: 5, comment: "Love the AI features!" },
  ];

  return (
    <TooltipProvider>
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
        onClick={() => onToolClick(tool.id, tool.url)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors flex items-center">
                {tool.name}
                {tool.isPro && (
                  <Badge className="ml-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs">
                    Pro
                  </Badge>
                )}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto" onClick={stopPropagation}>
                      <Info className="w-4 h-4 text-slate-400" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80" onClick={stopPropagation}>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">{tool.name}</h4>
                      <p className="text-sm text-slate-600">{tool.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {tool.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {tool.category}
                </Badge>
                <Badge className={`text-xs flex items-center space-x-1 ${getFreeOfferingColor(tool.freeOffering)}`}>
                  {getFreeOfferingIcon(tool.freeOffering)}
                  <span>{tool.freeOffering.replace('_', ' ')}</span>
                </Badge>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="transition-opacity"
                  onClick={(e) => onFavoriteClick(tool.id, e)}
                >
                  {isFavorite(tool.id) ? (
                    <Bookmark className="w-4 h-4 fill-current text-blue-600" />
                  ) : (
                    <Heart className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent onClick={stopPropagation}>
                <p>{isFavorite(tool.id) ? 'Remove from favorites' : 'Add to favorites'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
          <CardDescription className="mb-4 text-slate-600">
            {tool.description}
          </CardDescription>
          
          {/* Prominent Pricing Section */}
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-400 shadow-inner">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-green-300/70 px-2 py-1 rounded-full text-xs font-semibold text-green-900 uppercase">Pricing Info</span>
            </div>
            <p className="text-xs text-green-700 font-semibold">
              🎁 {tool.freeDetails}
            </p>
            <div className="mt-2">
              <Button 
                size="sm"
                variant="secondary"
                className="w-full text-green-800 bg-white hover:bg-green-50"
                onClick={stopPropagation}
                tabIndex={-1}
              >
                View Pricing
              </Button>
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="mb-4 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="font-medium text-slate-700 mr-2">Reviews & Ratings</span>
              <span className="text-xs text-slate-500">({reviews.length} reviews)</span>
            </div>
            <div className="space-y-1">
              {reviews.map((review, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="font-semibold text-slate-700">{review.name}:</span>
                  <span className="text-yellow-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                  <span className="text-slate-600 text-xs">{review.comment}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {tool.features.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {tool.features.length > 3 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs cursor-help" onClick={stopPropagation}>
                    +{tool.features.length - 3} more
                  </Badge>
                </TooltipTrigger>
                <TooltipContent onClick={stopPropagation}>
                  <div className="space-y-1">
                    {tool.features.slice(3).map((feature, idx) => (
                      <p key={idx} className="text-xs">{feature}</p>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 cursor-help" onClick={stopPropagation}>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{tool.rating}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent onClick={stopPropagation}>
                <p>Average user rating</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 cursor-help" onClick={stopPropagation}>
                  <Users className="w-4 h-4" />
                  <span>{tool.users}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent onClick={stopPropagation}>
                <p>Total users</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="mt-auto pt-4">
            <Button 
              className="w-full" 
              onClick={(e) => {
                stopPropagation(e);
                onToolClick(tool.id, tool.url);
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Use Tool
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
