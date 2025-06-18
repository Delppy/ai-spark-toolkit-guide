
import React, { useState } from "react";
import Layout from "@/components/Layout";
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

const ToolsWithFilters = () => {
  const { user } = useUserPreferences();
  const allTools = dataManager.getAllAITools();
  
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

  // Load favorites from database on mount
  React.useEffect(() => {
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
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', toolId);
        
        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== toolId));
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
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
    console.log(`Navigating to ${url} for tool ${toolId}`);
    window.open(url, "_blank");
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateFilter({ searchTerm: value });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
            Explore AI Tools
          </h2>
          <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto">
            Find the best AI tools to help you with any task. Search, filter, and discover tools that match your needs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search tools by name, category, or features..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

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
          <div className="text-slate-600">
            Showing {totalResults} of {allTools.length} tools
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
          />
        </div>

        {/* Tools Grid */}
        {filteredAndSortedTools.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No tools found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search terms or filters</p>
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
    </Layout>
  );
};

export default ToolsWithFilters;
