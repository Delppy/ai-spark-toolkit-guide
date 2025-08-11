
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
import { PromptPack } from '@/data/aiTools';
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
  
  // Determine access level
  const hasFullAccess = isPro;
  const hasLimitedAccess = !isPro && hasCredits;
  const isLocked = pack.isPro && !hasFullAccess && !hasLimitedAccess;
  
  // Show a fixed small number of prompts as preview
  const examplesList = pack.examples || [];
  const previewLimit = hasFullAccess ? 2 : (hasLimitedAccess ? 2 : 1);
  
  
  // Determine which prompts to show - always just preview
  const visiblePrompts = examplesList.slice(0, previewLimit);
  
  // For locked users in preview mode, show blurred prompts after the visible ones
  const hiddenPrompts = isLocked ? examplesList.slice(previewLimit, previewLimit + 1) : [];

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

  return (
    <div className="relative">
      <TooltipProvider>
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  <Link 
                    to={`/prompts/${pack.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {pack.title}
                  </Link>
                  {pack.isPro && (
                    <Badge variant="premium" className="ml-2 text-xs">
                      Pro
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {pack.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{pack.examples?.length || pack.prompts || 0} prompts</span>
                  {!isPro && hasLimitedAccess && (
                    <Badge variant="secondary" className="text-xs">
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
              {examplesList.length > 0 ? (
                <>
                  <p className="text-sm font-medium text-foreground">Example prompts:</p>
                  
                  {/* Show visible prompts */}
                  {visiblePrompts.map((example, idx) => (
                    <div key={idx} className="bg-muted p-3 rounded-lg border">
                      <p className="text-sm text-foreground mb-2">{example}</p>
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
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic">Examples coming soon...</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to={`/prompts/${pack.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View All Prompts ({examplesList.length})
                </Link>
              </Button>
              
              {/* Show upgrade button for locked users */}
              {isLocked && (
                <Button
                  className="w-full"
                  onClick={() => proGate()}
                >
                  Unlock with Pro
                </Button>
              )}
            </div>
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
