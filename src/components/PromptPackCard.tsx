
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
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Copy, Eye, DollarSign, Zap } from 'lucide-react';
import { PromptPack } from '@/data/promptPacks';
import { useProGate } from "@/hooks/useProGate";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { usePromptCredits } from "@/hooks/usePromptCredits";
import { Link } from 'react-router-dom';

interface PromptPackCardProps {
  pack: PromptPack;
  onCopyPrompt: (text: string) => void;
  isPreviewMode?: boolean;
}

export const PromptPackCard: React.FC<PromptPackCardProps> = ({
  pack,
  onCopyPrompt,
  isPreviewMode = false
}) => {
  // Pro gating and credits
  const { user } = useUserPreferences() as any;
  const userId = user?.id || null;
  const { isPro, proGate } = useProGate(userId);
  const { credits, useCredit, hasCredits } = usePromptCredits(userId);
  const [showAllPrompts, setShowAllPrompts] = React.useState(false);
  
  // Determine access level
  const hasFullAccess = isPro;
  const hasLimitedAccess = !isPro && hasCredits;
  const isLocked = pack.isPro && !hasFullAccess && !hasLimitedAccess;
  
  // Show different amounts based on access level
  const defaultLimit = hasFullAccess ? pack.examples.length : (hasLimitedAccess ? 3 : 2);
  const shouldShowViewAll = pack.examples.length > defaultLimit && hasFullAccess;
  
  // Determine which prompts to show
  const visiblePrompts = showAllPrompts 
    ? pack.examples 
    : pack.examples.slice(0, defaultLimit);
  
  // For locked users in preview mode, show blurred prompts after the visible ones
  const hiddenPrompts = isPreviewMode && isLocked && !showAllPrompts
    ? pack.examples.slice(defaultLimit)
    : [];

  const handleCopyPrompt = async (prompt: string) => {
    if (hasFullAccess) {
      onCopyPrompt(prompt);
    } else if (hasLimitedAccess) {
      const success = await useCredit();
      if (success) {
        onCopyPrompt(prompt);
      }
    } else {
      proGate();
    }
  };
    
  const handleActionClick = () => {
    if (isLocked) {
      proGate();
    } else if (hasFullAccess) {
      setShowAllPrompts(!showAllPrompts);
    } else {
      proGate();
    }
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                  <Link 
                    to={`/prompts/${pack.id}`}
                    className="hover:text-purple-600 transition-colors"
                  >
                    {pack.title}
                  </Link>
                  {pack.isPro && (
                    <Badge className="ml-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs">
                      Pro
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {pack.category}
                  </Badge>
                  <span className="text-sm text-slate-500">{pack.examples.length} prompts</span>
                  {!isPro && hasLimitedAccess && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {credits} credits
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              {pack.description}
            </CardDescription>

            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Example prompts:</p>
              
              {/* Show visible prompts */}
              {visiblePrompts.map((example, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border">
                  <p className="text-sm text-slate-700 mb-2">{example}</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyPrompt(example)}
                        className="text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {hasLimitedAccess && !hasFullAccess ? 'Copy (1 credit)' : 'Copy'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy prompt to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
              
              {/* Show blurred prompts for preview mode */}
              {hiddenPrompts.length > 0 && (
                <>
                  {hiddenPrompts.map((example, idx) => (
                    <div key={`hidden-${idx}`} className="relative bg-slate-50 p-3 rounded-lg border">
                      <div className="filter blur-sm pointer-events-none">
                        <p className="text-sm text-slate-700 mb-2">{example}</p>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-purple-600 border border-purple-200">
                          🔒 Upgrade to unlock
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Show button for locked users or when there are more prompts to view */}
            {(isLocked || shouldShowViewAll || (!hasFullAccess && !isLocked)) && (
              <Button
                className="w-full mt-4"
                variant={isLocked ? "default" : "outline"}
                onClick={handleActionClick}
              >
                {isLocked 
                  ? "Unlock with Pro" 
                  : hasLimitedAccess && !hasFullAccess 
                    ? "Upgrade to Pro for Unlimited Access"
                    : showAllPrompts 
                      ? "Show Less" 
                      : "View All Prompts"
                }
              </Button>
            )}
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
};

function LockIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17a1.5 1.5 0 003-3H9a1.5 1.5 0 003 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 11V9a5 5 0 00-10 0v2H5v8a2 2 0 002 2h10a2 2 0 002-2v-8h-2z" />
    </svg>
  );
}
