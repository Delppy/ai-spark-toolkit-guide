
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

interface PromptPackCardProps {
  pack: PromptPack;
  onCopyPrompt: (text: string) => void;
}

export const PromptPackCard: React.FC<PromptPackCardProps> = ({
  pack,
  onCopyPrompt
}) => {
  return (
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <h4 className="font-medium">Preview All Examples</h4>
                  {pack.examples.map((example, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border">
                      <p className="text-sm text-slate-700 mb-2">{example}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopyPrompt(example)}
                        className="text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            {pack.description}
          </CardDescription>
          
          {/* Always visible pricing information */}
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <p className="text-sm font-medium text-purple-700">
                {pack.isPro ? 'Pro Required' : 'Free Access'}
              </p>
            </div>
            <p className="text-xs text-purple-700">
              {pack.isPro ? 
                '💎 Unlock with Pro subscription' : 
                '🎁 Full access included for free'
              }
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Example prompts:</p>
            {pack.examples.slice(0, 2).map((example, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-lg border">
                <p className="text-sm text-slate-700 mb-2">{example}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCopyPrompt(example)}
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
          </div>

          <Button className="w-full mt-4" variant={pack.isPro ? "default" : "outline"}>
            {pack.isPro ? "Unlock with Pro" : "View All Prompts"}
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
