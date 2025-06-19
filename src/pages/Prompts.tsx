
import React from "react";
import Layout from "@/components/Layout";
import { PromptPackCard } from "@/components/PromptPackCard";
import { InContentAd } from "@/components/ads/InContentAd";
import { useAdPlacement } from "@/hooks/useAdPlacement";
import { schoolPromptPacks, contentPromptPacks, businessPromptPacks, careerPromptPacks, PromptPack } from "@/data/promptPacks";
import { toast } from "sonner";

const Prompts = () => {
  const promptPacks: PromptPack[] = [...schoolPromptPacks, ...contentPromptPacks, ...businessPromptPacks, ...careerPromptPacks];
  const { shouldShowInContentAd } = useAdPlacement();

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Prompt copied to clipboard!");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
            Browse Prompt Packs
          </h2>
          <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto">
            Supercharge your AI with our curated prompt packs for a variety of use cases.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promptPacks.map((pack, index) => (
            <React.Fragment key={pack.id}>
              <PromptPackCard 
                pack={pack}
                onCopyPrompt={handleCopyPrompt}
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
