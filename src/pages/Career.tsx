import React, { useState, useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import { ToolCard } from "@/components/ToolCard";
import { ToolFilters } from "@/components/ToolFilters";
import { ToolSorting } from "@/components/ToolSorting";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { dataManager } from "@/data/dataManager";
import { useToolFiltering } from "@/hooks/useToolFiltering";
import { Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { HighlightsSection } from "@/components/HighlightsSection";

const Career = () => {
  const { user } = useUserPreferences();
  const allTools = dataManager.getAllAITools();
  const { trackToolClick, getHighlightedTools, isLoading: analyticsLoading } = useToolAnalytics();
  
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
  } = useToolFiltering(allTools);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Set initial category filter for career
  useEffect(() => {
    // Filter for career related categories
    const careerCategories = getUniqueCategories().filter(cat => 
      cat.toLowerCase().includes('career') ||
      cat.toLowerCase().includes('job') ||
      cat.toLowerCase().includes('resume') ||
      cat.toLowerCase().includes('interview') ||
      cat.toLowerCase().includes('professional')
    );
    if (careerCategories.length > 0) {
      updateFilter({ categories: careerCategories });
    }
  }, [getUniqueCategories]);

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user?.id]);

  const loadFavorites = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('item_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const favoriteIds = data?.map(fav => fav.item_id) || [];
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleFavoriteClick = async (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.id) {
      toast.error("Please log in to save favorites");
      return;
    }

    try {
      const isFavorited = favorites.includes(toolId);
      
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', toolId);
        
        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== toolId));
        toast.success("Removed from favorites");
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            item_id: toolId
          });
        
        if (error) throw error;
        
        setFavorites(prev => [...prev, toolId]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error("Failed to update favorites");
    }
  };

  const handleToolClick = (toolId: string, url: string) => {
    const tool = allTools.find(t => t.id === toolId);
    if (tool) {
      trackToolClick(toolId, tool.category);
    }
    console.log(`Navigating to ${url} for tool ${toolId}`);
    window.open(url, "_blank");
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilter({ searchTerm: value });
  };

  // Get career related tools for highlights
  const careerTools = allTools.filter(tool => 
    tool.category.toLowerCase().includes('career') ||
    tool.category.toLowerCase().includes('job') ||
    tool.category.toLowerCase().includes('resume') ||
    tool.category.toLowerCase().includes('interview') ||
    tool.category.toLowerCase().includes('professional')
  );
  
  const highlightedTools = getHighlightedTools(careerTools, 3);

  return (
    <>
      <SEOHead 
        title="AI Tools for Career Development"
        description="Advance your career with AI tools for job searching, resume building, interview prep, and professional development."
        keywords={["AI tools", "career", "job search", "resume", "interview", "professional development"]}
        canonicalUrl="https://aitouse.app/career"
      />
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AI Tools for Career Development
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Supercharge your career growth with AI-powered tools for job searching, skill development, and professional networking.
            </p>
          </div>
          
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search career development tools..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>

          {/* Highlights Section */}
          <HighlightsSection
            highlightedTools={highlightedTools}
            isLoading={analyticsLoading}
            onToolClick={handleToolClick}
            onFavoriteClick={handleFavoriteClick}
            isFavorite={isFavorite}
          />

          <ToolFilters
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
            categories={getUniqueCategories()}
            freeOfferings={getUniqueFreeOfferings()}
            hasActiveFilters={hasActiveFilters}
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="text-muted-foreground">
              Showing {totalResults} career tools
            </div>
            <ToolSorting
              sort={sort}
              onSortChange={updateSort}
              totalResults={totalResults}
            />
          </div>

          {filteredAndSortedTools.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No career tools found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </div>
      </Layout>
    </>
  );
};

export default Career;