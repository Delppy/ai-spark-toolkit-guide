
import React, { useState } from "react";
import { PromptPackCard } from "@/components/PromptPackCard";
import { PromptRefinerySection } from "@/components/PromptRefinerySection";
import { NewAd } from "@/components/ads/NewAd";
import { ProfitableRateAd } from "@/components/ads/ProfitableRateAd";
import { dataManager } from "@/data/dataManager";
import { Button } from "@/components/ui/button";
import { Crown, BookOpen, Video, Briefcase, User, Filter, Grid } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Prompts = () => {
  // State for filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Get all prompt packs organized by category
  const schoolPromptPacks = dataManager.getCategoryData('school').promptPacks;
  const contentPromptPacks = dataManager.getCategoryData('content').promptPacks;
  const businessPromptPacks = dataManager.getCategoryData('business').promptPacks;
  const careerPromptPacks = dataManager.getCategoryData('career').promptPacks;
  
  // Filter categories with access level filtering
  const categories = [
    { id: 'all', name: 'All Categories', icon: Grid, count: schoolPromptPacks.length + contentPromptPacks.length + businessPromptPacks.length + careerPromptPacks.length },
    { id: 'school', name: 'School & Education', icon: BookOpen, count: schoolPromptPacks.length, packs: schoolPromptPacks },
    { id: 'content', name: 'Content Creation', icon: Video, count: contentPromptPacks.length, packs: contentPromptPacks },
    { id: 'business', name: 'Business & Work', icon: Briefcase, count: businessPromptPacks.length, packs: businessPromptPacks },
    { id: 'career', name: 'Career & Jobs', icon: User, count: careerPromptPacks.length, packs: careerPromptPacks },
    { id: 'free', name: 'Free Packs', icon: BookOpen, count: [...schoolPromptPacks, ...contentPromptPacks, ...businessPromptPacks, ...careerPromptPacks].filter(pack => !pack.isPro).length },
    { id: 'premium', name: 'Premium Only', icon: Crown, count: [...schoolPromptPacks, ...contentPromptPacks, ...businessPromptPacks, ...careerPromptPacks].filter(pack => pack.isPro).length }
  ];
  
  // Get filtered prompt packs based on selected category with precise filtering
  const getFilteredPromptPacks = () => {
    let allPacks = [...schoolPromptPacks, ...contentPromptPacks, ...businessPromptPacks, ...careerPromptPacks];
    
    if (selectedCategory === 'all') {
      return allPacks;
    } else if (selectedCategory === 'free') {
      // Show only packs that are completely free (isPro: false)
      return allPacks.filter(pack => !pack.isPro);
    } else if (selectedCategory === 'premium') {
      // Show only premium packs (isPro: true)
      return allPacks.filter(pack => pack.isPro);
    } else {
      // Show packs from specific category
      const category = categories.find(cat => cat.id === selectedCategory);
      return category?.packs || [];
    }
  };
  
  const filteredPromptPacks = getFilteredPromptPacks();

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Prompt copied to clipboard!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-amber-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              Prompt Packs
            </h2>
          </div>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Access 200+ expertly crafted AI prompts organized by category to supercharge your productivity.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Filter by Category</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 h-auto py-3 px-4 rounded-lg transition-all duration-200 ${
                    isSelected 
                      ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" 
                      : "border-border text-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                  <Badge 
                    variant={isSelected ? "secondary" : "outline"}
                    className={`ml-1 ${
                      isSelected 
                        ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30" 
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* AI Prompt Refinery Section */}
        <div className="mb-8">
          <PromptRefinerySection />
        </div>

        {/* Prompt Packs Grid */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {selectedCategory === 'all' 
              ? 'All Prompt Packs' 
              : categories.find(cat => cat.id === selectedCategory)?.name
            }
          </h3>
          <p className="text-muted-foreground">
            {filteredPromptPacks.length} prompt pack{filteredPromptPacks.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromptPacks.map((pack, index) => (
            <div key={pack.id} className="contents">
              <PromptPackCard 
                pack={pack}
                onCopyPrompt={handleCopyPrompt}
                isPreviewMode={false}
              />
              {(index + 1) % 6 === 0 && (
                <div className="col-span-full space-y-4">
                  <NewAd />
                  <ProfitableRateAd />
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPromptPacks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No prompt packs found in this category.</p>
          </div>
      )}
    </div>
  );
};

export default Prompts;
