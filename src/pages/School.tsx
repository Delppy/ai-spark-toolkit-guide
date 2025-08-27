import React from 'react';
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

import { useState, useEffect } from 'react';

const School = () => {
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

  // Set initial category filter for school
  useEffect(() => {
    // Filter for any category containing "Education" or school-related terms
    const schoolCategories = getUniqueCategories().filter(cat => 
      cat.toLowerCase().includes('education') || 
      cat.toLowerCase().includes('essay') ||
      cat.toLowerCase().includes('research') ||
      cat.toLowerCase().includes('learning')
    );
    if (schoolCategories.length > 0) {
      updateFilter({ categories: schoolCategories });
    }
  }, [getUniqueCategories]);

  // Load favorites from database on mount
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

  // Get school/education related tools for highlights
  const schoolTools = allTools.filter(tool => 
    tool.category.toLowerCase().includes('education') || 
    tool.category.toLowerCase().includes('essay') ||
    tool.category.toLowerCase().includes('research') ||
    tool.category.toLowerCase().includes('learning') ||
    tool.category.toLowerCase().includes('school')
  );
  
  const highlightedTools = getHighlightedTools(schoolTools, 3);

  return (
    <>
      <SEOHead 
        title="AI Tools for School & Education"
        description="Discover the best AI tools for students, teachers, and educational institutions. Enhance learning with cutting-edge artificial intelligence."
        keywords={["AI tools", "education", "students", "teachers", "school", "learning"]}
        canonicalUrl="https://aitouse.app/school"
      />
      <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AI Tools for School & Education
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your learning experience with AI-powered tools designed for students, educators, and academic institutions.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search education AI tools..."
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

          {/* Filters */}
          <ToolFilters
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
            categories={getUniqueCategories()}
            freeOfferings={getUniqueFreeOfferings()}
            hasActiveFilters={hasActiveFilters}
          />


          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="text-muted-foreground">
              Showing {totalResults} education tools
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-2"
                >
                  Clear filters
                </Button>
              )}
            </div>
            <ToolSorting
              sort={sort}
              onSortChange={updateSort}
              totalResults={totalResults}
            />
          </div>

          {/* Tools Grid */}
          {filteredAndSortedTools.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No education tools found</h3>
              <p className="text-muted-foreground/70 mb-4">Try adjusting your search terms or filters</p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
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
    </>
  );
};

export default School;