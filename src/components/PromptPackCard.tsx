
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
import { Copy, Eye, DollarSign } from 'lucide-react';
import { PromptPack } from '@/data/promptPacks';
import { useProGate } from "@/hooks/useProGate";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

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
  // Pro gating
  const { user } = useUserPreferences() as any;
  const userId = user?.id || null;
  const { isPro, proGate } = useProGate(userId);
  const isLocked = pack.isPro && !isPro;
  const [showAllPrompts, setShowAllPrompts] = React.useState(false);
  
  // For preview mode, show 2 prompts, then blur the rest
  const previewLimit = 2;
  const visiblePrompts = isPreviewMode && isLocked 
    ? pack.examples.slice(0, previewLimit)
    : pack.examples;
  const hiddenPrompts = isPreviewMode && isLocked 
    ? pack.examples.slice(previewLimit)
    : [];
    
  const handleActionClick = () => {
    if (isLocked) {
      proGate();
    } else {
      setShowAllPrompts(!showAllPrompts);
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
                  {pack.title}
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
                  <span className="text-sm text-slate-500">{pack.prompts} prompts</span>
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
              {(showAllPrompts ? pack.examples : visiblePrompts).map((example, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border">
                  <p className="text-sm text-slate-700 mb-2">{example}</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={isLocked ? () => proGate() : () => onCopyPrompt(example)}
                        className="text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
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

            {/* Only show button if user is not pro or if they want to see all prompts */}
            {(isLocked || !showAllPrompts) && (
              <Button
                className="w-full mt-4"
                variant={isLocked ? "default" : "outline"}
                onClick={handleActionClick}
              >
                {isLocked ? "Unlock with Pro" : (showAllPrompts ? "Show Less" : "View All Prompts")}
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
