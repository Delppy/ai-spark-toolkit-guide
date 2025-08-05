
import React from "react";
import Layout from "@/components/Layout";
import { PromptPackCard } from "@/components/PromptPackCard";
import { InContentAd } from "@/components/ads/InContentAd";
import { useAdPlacement } from "@/hooks/useAdPlacement";
import { schoolPromptPacks, contentPromptPacks, businessPromptPacks, careerPromptPacks, PromptPack } from "@/data/promptPacks";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useProGate } from "@/hooks/useProGate";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Prompts = () => {
  const { user } = useUserPreferences();
  const { isPro } = useSubscription(user?.id);
  const { proGate } = useProGate(user?.id);
  
  const promptPacks: PromptPack[] = [...schoolPromptPacks, ...contentPromptPacks, ...businessPromptPacks, ...careerPromptPacks];
  const { shouldShowInContentAd } = useAdPlacement();

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Prompt copied to clipboard!");
  };

  // If user is not logged in, show full paywall
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              Premium Prompt Packs
            </h2>
            <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto">
              Unlock professional AI prompt collections with your Premium subscription.
            </p>
          </div>
          
          {/* Paywall Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Premium Feature
              </h3>
              
              <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
                Our curated prompt packs are exclusively available to Premium subscribers. 
                Get access to {promptPacks.length}+ professional prompts designed by experts.
              </p>
              
              <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  What's included:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700">Professional business prompts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700">Creative content templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700">Academic writing guides</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700">Career advancement prompts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700">Copy-ready examples</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700">Regular updates</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                  <Link to="/pricing">
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to Premium
                  </Link>
                </Button>
                {!user && (
                  <Button asChild variant="outline" size="lg">
                    <Link to="/login">Login to Continue</Link>
                  </Button>
                )}
              </div>
              
              <p className="text-sm text-slate-500 mt-4">
                Already have Premium? {user ? "Your subscription may still be processing." : "Please log in to access your prompts."}
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-amber-500" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              Premium Prompt Packs
            </h2>
          </div>
          <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto">
            Supercharge your AI with our curated prompt packs for a variety of use cases.
          </p>
          {!isPro && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-slate-600">
                🎁 Preview available! Unlock all {promptPacks.length}+ premium prompts with Pro
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promptPacks.map((pack, index) => (
            <React.Fragment key={pack.id}>
              <PromptPackCard 
                pack={pack}
                onCopyPrompt={handleCopyPrompt}
                isPreviewMode={!isPro}
              />
              {/* Show in-content ad every 6 cards */}
              {shouldShowInContentAd(index) && (
                <div className="col-span-full">
                  <InContentAd />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Prompts;
