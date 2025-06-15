
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { dataManager } from "@/data/dataManager";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useToolFiltering } from "@/hooks/useToolFiltering";
import { ToolFilters } from "@/components/ToolFilters";
import { ToolSorting } from "@/components/ToolSorting";
import { ToolCard } from "@/components/ToolCard";
import { PromptPackCard } from "@/components/PromptPackCard";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";

const CategorySchool = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { toggleFavorite, isFavorite, addToRecentlyViewed } = useUserPreferences();

  const categoryData = dataManager.getCategoryData('school');
  const aiTools = categoryData.aiTools;
  const promptPacks = categoryData.promptPacks;

  const {
    filteredAndSortedTools,
    filters,
    sort,
    updateFilter,
    updateSort,
    clearFilters,
    getUniqueCategories,
    getUniqueFreeOfferings,
    totalResults,
    hasActiveFilters
  } = useToolFiltering(aiTools);

  // Track logged-in user
  const [userId, setUserId] = React.useState<string | null>(null);
  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Use subscription status; if not logged in, isPro is false
  const { isPro } = useSubscription(userId ?? undefined);

  // Update search filter when searchTerm changes
  React.useEffect(() => {
    updateFilter('searchTerm', searchTerm);
  }, [searchTerm, updateFilter]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The prompt has been copied to your clipboard.",
    });
  };

  const handleToolClick = (toolId: string, url: string) => {
    addToRecentlyViewed(toolId);
    window.open(url, '_blank');
  };

  const handleFavoriteClick = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(toolId);
    toast({
      title: isFavorite(toolId) ? "Removed from favorites" : "Added to favorites",
      description: isFavorite(toolId) 
        ? "Tool removed from your favorites" 
        : "Tool added to your favorites",
    });
  };

  // Only show Pro tools if user is logged in and Pro
  const visibleTools = filteredAndSortedTools.filter(tool =>
    !tool.isPro || (userId && isPro)
  );
  // Only show Pro prompt packs if user is logged in and Pro
  const visiblePromptPacks = promptPacks.filter(pack =>
    !pack.isPro || (userId && isPro)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-slate-900">School & Education</h1>
              </div>
            </div>
            {/* Hide Get Pro button for users who aren't logged in */}
            {userId && !isPro && (
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-600">
                Get Pro
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
            AI Tools for Students
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover AI tools and prompts to help with essays, research, studying, and academic projects. All tools offer free access or trials!
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4">
        <ToolFilters
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          categories={getUniqueCategories()}
          freeOfferings={getUniqueFreeOfferings()}
          hasActiveFilters={hasActiveFilters}
        />
      </section>

      {/* AI Tools Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">AI Tools for School</h3>
        </div>
        
        <ToolSorting
          sort={sort}
          onSortChange={updateSort}
          totalResults={visibleTools.length}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {visibleTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onFavoriteClick={handleFavoriteClick}
              onToolClick={handleToolClick}
              isFavorite={isFavorite}
            />
          ))}
        </div>

        {visibleTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No tools found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="mt-4"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </section>

      {/* Prompt Packs */}
      <section className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Student Prompt Packs</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {visiblePromptPacks.map((pack) => (
            <PromptPackCard
              key={pack.id}
              pack={pack}
              onCopyPrompt={copyToClipboard}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategorySchool;
