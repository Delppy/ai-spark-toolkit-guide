
import React, { useState } from "react";
import { PromptPackCard } from "@/components/PromptPackCard";
import { PromptRefinerySection } from "@/components/PromptRefinerySection";
import { NewAd } from "@/components/ads/NewAd";
import { ProfitableRateAd } from "@/components/ads/ProfitableRateAd";
import { dataManager } from "@/data/dataManager";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useProGate } from "@/hooks/useFreeAccess";
import { useSubscription } from "@/hooks/useFreeAccess";
import { Button } from "@/components/ui/button";
import { Lock, Crown, BookOpen, Video, Briefcase, User, Filter, Grid } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Prompts = () => {
  const { user } = useUserPreferences();
  const { isPro } = useSubscription();
  const { proGate } = useProGate();
  
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

  // If user is not logged in, show full paywall
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-primary/80 bg-clip-text text-transparent">
              Premium Prompt Packs
            </h2>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
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
                Get access to 200+ professional prompts designed by experts.
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
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-amber-500" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-primary/80 bg-clip-text text-transparent">
              Premium Prompt Packs
            </h2>
          </div>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Access 200+ expertly crafted AI prompts organized by category to supercharge your productivity.
          </p>
          {!isPro && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-slate-600">
                🎁 Preview available! Unlock all premium prompts with Pro
              </p>
            </div>
          )}
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
                isPreviewMode={!isPro}
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
