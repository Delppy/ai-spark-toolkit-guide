import { useParams, Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Star, Sparkles } from 'lucide-react';
import { dataManager } from '@/data/dataManager';
import { useProGate } from "@/hooks/useProGate";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { toast } from "sonner";
import SEOHead from '@/components/SEOHead';

const PromptPack = () => {
  const { packId } = useParams<{ packId: string }>();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const { user } = useUserPreferences() as any;
  const userId = user?.id || null;
  const { isPro, proGate } = useProGate();

  // Find the prompt pack by ID across all categories
  const allPromptPacks = dataManager.getAllPromptPacks();
  const pack = allPromptPacks.find(p => p.id === packId || p.title.toLowerCase().replace(/\s+/g, '-') === packId);

  if (!pack) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Prompt Pack Not Found</h1>
          <p className="text-slate-600 mb-8">The prompt pack you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/prompts">Browse All Prompt Packs</Link>
        </Button>
      </div>
    );
  }

  const isLocked = pack.isPro && !isPro;

  const handleCopyPrompt = (text: string, index: number) => {
    if (isLocked) {
      proGate();
      return;
    }

    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Prompt copied to clipboard!");
    
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      <SEOHead 
        title={`${pack.title} - AI Prompt Pack`}
        description={`${pack.description} Access ${pack.examples.length} professional AI prompts for ${pack.category.toLowerCase()}.`}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/prompts">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Prompt Packs
            </Link>
          </Button>
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {pack.title}
                {pack.isPro && (
                  <Badge className="ml-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </h1>
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="text-sm">
                  {pack.category}
                </Badge>
                <span className="text-slate-600">{pack.examples.length} prompts</span>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 max-w-3xl">
            {pack.description}
          </p>
        </div>

        {/* Lock Notice for Pro Packs */}
        {isLocked && (
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900">Premium Prompt Pack</h3>
                  <p className="text-amber-700 text-sm">
                    Upgrade to Pro to unlock all {pack.examples.length} professional prompts in this pack.
                  </p>
                </div>
                <Button onClick={proGate} className="ml-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prompts Grid */}
        <div className="grid gap-6">
          <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
            <Copy className="w-6 h-6 mr-2 text-purple-600" />
            All Prompts ({pack.examples.length})
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pack.examples.map((example, index) => (
              <Card 
                key={index} 
                className={`transition-all duration-300 hover:shadow-md ${
                  isLocked && index >= 2 ? 'relative overflow-hidden' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base text-slate-700">
                      Prompt #{index + 1}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyPrompt(example, index)}
                      className={`transition-colors ${
                        copiedIndex === index 
                          ? 'bg-green-100 text-green-700' 
                          : isLocked && index >= 2
                          ? 'opacity-50'
                          : 'hover:bg-purple-50 hover:text-purple-700'
                      }`}
                      disabled={isLocked && index >= 2}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copiedIndex === index ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-slate-700 leading-relaxed ${
                    isLocked && index >= 2 ? 'filter blur-sm' : ''
                  }`}>
                    {example}
                  </p>
                  
                  {/* Lock overlay for non-pro users */}
                  {isLocked && index >= 2 && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-purple-100 p-3 rounded-full inline-block mb-3">
                          <Sparkles className="w-6 h-6 text-purple-600" />
                        </div>
                        <p className="text-sm font-medium text-purple-900 mb-2">Pro Feature</p>
                        <Button 
                          onClick={proGate}
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                        >
                          Unlock Now
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Ready to boost your productivity?
              </h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Explore more professional prompt packs designed to help you work smarter and faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                  <Link to="/prompts">Browse All Prompt Packs</Link>
                </Button>
                {!isPro && (
                  <Button onClick={proGate} variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                    Upgrade to Pro
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PromptPack;