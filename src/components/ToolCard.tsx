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
import { useProGate } from '@/hooks/useProGate';
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

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
  // Needed to get userId for Pro gating
  const { user } = useUserPreferences() as any; // Or from context/auth
  const userId = user?.id || null;
  const { isPro, proGate } = useProGate(userId);
  const navigate = useNavigate();

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

  // Is this a locked (Pro-protected) card for non-Pro users?
  const isLocked = tool.isPro && !isPro;

  // Show overlay and block interaction for Pro tools if not unlocked
  return (
    <TooltipProvider>
      <div className="relative"> 
        <Card 
          className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col ${isLocked ? "opacity-60 blur-[1.5px] pointer-events-none select-none" : ""}`}
          onClick={isLocked
            ? (e) => proGate(e)
            : () => onToolClick(tool.id, tool.url)
          }
          tabIndex={0}
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
                    onClick={isLocked 
                      ? (e) => proGate(e)
                      : (e) => onFavoriteClick(tool.id, e)
                    }
                  >
                    {isFavorite(tool.id) ? (
                      <Bookmark className="w-4 h-4 fill-current text-blue-600" />
                    ) : (
                      <Heart className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent onClick={stopPropagation}>
                  <p>{isLocked 
                    ? "Get Pro to unlock favorites!" 
                    : (isFavorite(tool.id) ? "Remove from favorites" : "Add to favorites")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            <CardDescription className="mb-4 text-slate-600">
              {tool.description}
            </CardDescription>
            
            {/* Reviews section removed */}

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
                onClick={(e) => isLocked 
                  ? proGate(e)
                  : (() => { stopPropagation(e); onToolClick(tool.id, tool.url); })()
                }
                variant={tool.isPro ? "default" : "outline"}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isLocked ? "Unlock with Pro" : "Use Tool"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overlay lock if locked */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 z-10 rounded-lg pointer-events-auto" style={{backdropFilter:"blur(3px)"}}>
            <LockIcon className="mb-2 text-blue-600 w-8 h-8" />
            <div className="font-semibold text-blue-700 text-lg mb-2">Pro Feature</div>
            <Button className="w-32" onClick={proGate}>Get Pro Access</Button>
          </div>
        )}

      </div>
    </TooltipProvider>
  );
};

// Lock icon
function LockIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17a1.5 1.5 0 003-3H9a1.5 1.5 0 003 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 11V9a5 5 0 00-10 0v2H5v8a2 2 0 002 2h10a2 2 0 002-2v-8h-2z" />
    </svg>
  );
}
