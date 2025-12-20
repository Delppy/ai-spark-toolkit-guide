import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Zap, Copy, RefreshCw, Infinity } from "lucide-react";
import { toast } from "sonner";
import type { AiToUsePromptResponse } from "@/types/promptRefinery";

export const PromptRefinerySection: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [generatedPrompts, setGeneratedPrompts] = useState<AiToUsePromptResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter your prompt idea first");
      return;
    }

    setIsGenerating(true);
    try {
      // Mock API response for now - this would be replaced with actual AI call
      const mockResponse: AiToUsePromptResponse = {
        assumptions: "Assuming you want a creative prompt focused on productivity and efficiency",
        primary_prompt: {
          title: "Enhanced Productivity Prompt",
          prompt: `Act as a productivity expert. Help me ${userInput.toLowerCase()}. Provide specific, actionable steps that I can implement immediately. Structure your response with clear headings and bullet points for easy scanning.`,
          notes: "This prompt emphasizes actionable outcomes and clear structure"
        },
        alternate_prompts: [
          {
            title: "Creative Approach",
            prompt: `Take a creative approach to ${userInput.toLowerCase()}. Think outside the box and suggest innovative solutions I might not have considered.`
          },
          {
            title: "Step-by-Step Guide",
            prompt: `Break down how to ${userInput.toLowerCase()} into a detailed step-by-step process. Number each step and explain why it's important.`
          }
        ]
      };

      setGeneratedPrompts(mockResponse);
      toast.success("Prompts generated successfully!");
    } catch (error) {
      toast.error("Failed to generate prompts. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Prompt copied to clipboard!");
  };

  const handleReset = () => {
    setUserInput("");
    setGeneratedPrompts(null);
  };

  return (
    <Card className="border border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl">AI Prompt Refinery</CardTitle>
            <Badge variant="secondary" className="bg-primary text-primary-foreground border-0">
              <Infinity className="w-3 h-3 mr-1" />
              Unlimited
            </Badge>
          </div>
        </div>
        <CardDescription className="text-base">
          Transform unlimited ideas into polished AI prompts.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground block">
            Describe what you want to achieve:
          </label>
          <Textarea
            placeholder="e.g., 'write a blog post about sustainable living' or 'help me plan a marketing campaign'"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isGenerating}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 min-w-[200px]"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Refined Prompts
              </>
            )}
          </Button>
          
          {generatedPrompts && (
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          )}
        </div>


        {generatedPrompts && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Assumptions Made:</h3>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {generatedPrompts.assumptions}
              </p>
            </div>

            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-primary">
                    🎯 {generatedPrompts.primary_prompt.title}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(generatedPrompts.primary_prompt.prompt)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed mb-3">
                  {generatedPrompts.primary_prompt.prompt}
                </p>
                {generatedPrompts.primary_prompt.notes && (
                  <p className="text-xs text-muted-foreground italic">
                    💡 {generatedPrompts.primary_prompt.notes}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedPrompts.alternate_prompts.map((alt, index) => (
                <Card key={index} className="border-muted">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {alt.title}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(alt.prompt)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">
                      {alt.prompt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};