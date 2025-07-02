
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { dataManager } from "@/data/dataManager";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useToolFiltering } from "@/hooks/useToolFiltering";
import { ToolFilters } from "@/components/ToolFilters";
import { ToolSorting } from "@/components/ToolSorting";
import { ToolCard } from "@/components/ToolCard";
import { PromptPackCard } from "@/components/PromptPackCard";

const CategoryContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { toggleFavorite, isFavorite, addToRecentlyViewed } = useUserPreferences();

  const categoryData = dataManager.getCategoryData('content');
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

  // Update search filter when searchTerm changes
  React.useEffect(() => {
    updateFilter({ searchTerm });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Simplified Header - Remove custom header to use main Layout */}
      <section className="container mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Video className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold text-slate-900">Content Creation</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-900 to-pink-900 bg-clip-text text-transparent">
            AI Tools for Creators
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Create stunning content with AI-powered tools for video, design, audio, and more. From social media posts to professional presentations!
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search content tools..."
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
          <h3 className="text-2xl font-bold text-slate-900">Content Creation Tools</h3>
        </div>
        
        <ToolSorting
          sort={sort}
          onSortChange={updateSort}
          totalResults={totalResults}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAndSortedTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onFavoriteClick={handleFavoriteClick}
              onToolClick={handleToolClick}
              isFavorite={isFavorite}
            />
          ))}
        </div>

        {filteredAndSortedTools.length === 0 && (
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
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Creator Prompt Packs</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {promptPacks.map((pack) => (
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

export default CategoryContent;
