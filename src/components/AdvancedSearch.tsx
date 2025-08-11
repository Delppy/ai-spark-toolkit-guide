
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, TrendingUp, Clock, Star } from 'lucide-react';
import { dataManager } from '@/data/dataManager';
import { AITool } from '@/data/aiTools';

interface SearchSuggestion {
  type: 'tool' | 'category' | 'feature' | 'trending';
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface AdvancedSearchProps {
  onSearch: (term: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  showFilters?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onSuggestionSelect,
  placeholder = "Search AI tools, categories, or features...",
  showFilters = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const allTools = dataManager.getAllAITools();

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('aitouse-recent-searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      generateSuggestions(searchTerm);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const generateSuggestions = (term: string) => {
    const lowercaseTerm = term.toLowerCase();
    const suggestions: SearchSuggestion[] = [];

    // Tool name suggestions
    allTools
      .filter(tool => tool.name.toLowerCase().includes(lowercaseTerm))
      .slice(0, 3)
      .forEach(tool => {
        suggestions.push({
          type: 'tool',
          value: tool.name,
          label: tool.name,
          icon: <Star className="w-4 h-4" />
        });
      });

    // Category suggestions
    const categories = Array.from(new Set(allTools.map(tool => tool.category)));
    categories
      .filter(category => category.toLowerCase().includes(lowercaseTerm))
      .slice(0, 2)
      .forEach(category => {
        suggestions.push({
          type: 'category',
          value: `category:${category}`,
          label: `Category: ${category}`,
        });
      });

    // Feature suggestions
    const features = Array.from(new Set(allTools.flatMap(tool => tool.features)));
    features
      .filter(feature => feature.toLowerCase().includes(lowercaseTerm))
      .slice(0, 2)
      .forEach(feature => {
        suggestions.push({
          type: 'feature',
          value: `feature:${feature}`,
          label: `Feature: ${feature}`,
        });
      });

    // Trending suggestions (mock data - you can replace with real trending data)
    if (lowercaseTerm.length <= 2) {
      ['ChatGPT', 'Midjourney', 'Claude AI'].forEach(trending => {
        if (trending.toLowerCase().includes(lowercaseTerm)) {
          suggestions.push({
            type: 'trending',
            value: trending,
            label: trending,
            icon: <TrendingUp className="w-4 h-4 text-accent" />
          });
        }
      });
    }

    setSuggestions(suggestions.slice(0, 8));
  };

  const handleSearch = (term: string) => {
    if (term.trim()) {
      onSearch(term);
      
      // Add to recent searches
      const newRecentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('aitouse-recent-searches', JSON.stringify(newRecentSearches));
      
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchTerm(suggestion.value);
    handleSearch(suggestion.value);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
    onSearch('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(searchTerm);
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-12 py-4 text-lg border-2 border-input focus:border-primary rounded-xl"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">Suggestions</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-muted rounded-lg text-left"
                >
                  {suggestion.icon || <Search className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-foreground">{suggestion.label}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {suggestion.type}
                  </Badge>
                </button>
              ))}
            </div>
          )}

          {recentSearches.length > 0 && searchTerm.length === 0 && (
            <div className="p-2 border-t border-border">
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">Recent Searches</div>
              {recentSearches.map((recent, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(recent)}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-muted rounded-lg text-left"
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{recent}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
