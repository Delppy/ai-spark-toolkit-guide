
import { useState, useMemo } from 'react';
import { AITool } from '@/data/aiTools';

export interface FilterOptions {
  categories: string[];
  freeOfferings: string[];
  ratings: { min: number; max: number };
  isPro: boolean | null;
  searchTerm: string;
}

export interface SortOptions {
  field: 'name' | 'rating' | 'users' | 'category';
  direction: 'asc' | 'desc';
}

export const useToolFiltering = (tools: AITool[]) => {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    freeOfferings: [],
    ratings: { min: 0, max: 5 },
    isPro: null,
    searchTerm: ''
  });

  const [sort, setSort] = useState<SortOptions>({
    field: 'rating',
    direction: 'desc'
  });

  const filteredAndSortedTools = useMemo(() => {
    let filtered = tools.filter(tool => {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          tool.name.toLowerCase().includes(searchLower) ||
          tool.category.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.features.some(feature => feature.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(tool.category)) {
        return false;
      }

      // Free offering filter
      if (filters.freeOfferings.length > 0 && !filters.freeOfferings.includes(tool.freeOffering)) {
        return false;
      }

      // Rating filter
      if (tool.rating < filters.ratings.min || tool.rating > filters.ratings.max) {
        return false;
      }

      // Pro filter
      if (filters.isPro !== null && tool.isPro !== filters.isPro) {
        return false;
      }

      return true;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sort.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'users':
          // Convert users string to number for comparison
          const usersA = parseFloat(a.users.replace(/[^\d.]/g, ''));
          const usersB = parseFloat(b.users.replace(/[^\d.]/g, ''));
          comparison = usersA - usersB;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [tools, filters, sort]);

  const updateFilter = (changes: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...changes }));
  };

  const updateSort = (field: SortOptions['field'], direction?: SortOptions['direction']) => {
    setSort(prev => ({
      field,
      direction: direction || (prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc')
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      freeOfferings: [],
      ratings: { min: 0, max: 5 },
      isPro: null,
      searchTerm: ''
    });
  };

  const getUniqueCategories = () => {
    return Array.from(new Set(tools.map(tool => tool.category))).sort();
  };

  const getUniqueFreeOfferings = () => {
    return Array.from(new Set(tools.map(tool => tool.freeOffering))).sort();
  };

  return {
    filteredAndSortedTools,
    filters,
    sort,
    updateFilter,
    updateSort,
    clearFilters,
    getUniqueCategories,
    getUniqueFreeOfferings,
    totalResults: filteredAndSortedTools.length,
    hasActiveFilters: Object.values(filters).some(value => 
      Array.isArray(value) ? value.length > 0 : 
      typeof value === 'object' && value !== null ? value.min > 0 || value.max < 5 :
      value !== null && value !== ''
    )
  };
};
