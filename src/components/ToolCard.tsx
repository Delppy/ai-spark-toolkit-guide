
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

  return (
    <TooltipProvider>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
                    <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                      <Info className="w-4 h-4 text-slate-400" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
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
              <TooltipContent>
                <p>{isFavorite(tool.id) ? 'Remove from favorites' : 'Add to favorites'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4 text-slate-600">
            {tool.description}
          </CardDescription>
          
          {/* Always visible pricing information */}
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <p className="text-sm font-medium text-green-700">
                Pricing
              </p>
            </div>
            <p className="text-xs text-green-700">
              🎁 {tool.freeDetails}
            </p>
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
                  <Badge variant="outline" className="text-xs cursor-help">
                    +{tool.features.length - 3} more
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    {tool.features.slice(3).map((feature, idx) => (
                      <p key={idx} className="text-xs">{feature}</p>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 cursor-help">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{tool.rating}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Average user rating</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 cursor-help">
                  <Users className="w-4 h-4" />
                  <span>{tool.users}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total users</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Button 
            className="w-full" 
            onClick={() => onToolClick(tool.id, tool.url)}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Use Tool
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
