
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { FilterOptions } from '@/hooks/useToolFiltering';
import { Filter, X, ChevronDown } from 'lucide-react';

interface ToolFiltersProps {
  filters: FilterOptions;
  onFilterChange: (changes: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
  categories: string[];
  freeOfferings: string[];
  hasActiveFilters: boolean;
}

export const ToolFilters: React.FC<ToolFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  categories,
  freeOfferings,
  hasActiveFilters
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    onFilterChange({ categories: newCategories });
  };

  const handleFreeOfferingChange = (offering: string, checked: boolean) => {
    const newOfferings = checked
      ? [...filters.freeOfferings, offering]
      : filters.freeOfferings.filter(o => o !== offering);
    onFilterChange({ freeOfferings: newOfferings });
  };

  const handleProStatusChange = (isPro: boolean | null) => {
    onFilterChange({ isPro });
  };

  const handleRatingChange = (value: number[]) => {
    onFilterChange({ ratings: { min: value[0], max: value[1] } });
  };

  const freeOfferingLabels: Record<string, string> = {
    'free': 'Completely Free',
    'free_trial': 'Free Trial',
    'free_credits': 'Free Credits',
    'freemium': 'Freemium'
  };

  const getActiveFilterCount = (filterType: string) => {
    switch (filterType) {
      case 'categories':
        return filters.categories.length;
      case 'freeOfferings':
        return filters.freeOfferings.length;
      case 'accessType':
        return filters.isPro !== null ? 1 : 0;
      case 'rating':
        return filters.ratings.min > 0 || filters.ratings.max < 5 ? 1 : 0;
      default:
        return 0;
    }
  };

  return (
    <Card className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearFilters();
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-4">
              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-32">
                    Categories
                    {getActiveFilterCount('categories') > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {getActiveFilterCount('categories')}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto bg-white border shadow-lg">
                  {categories.map(category => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Upgrade Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-32">
                    Upgrade Options
                    {getActiveFilterCount('freeOfferings') > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {getActiveFilterCount('freeOfferings')}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border shadow-lg">
                  {freeOfferings.map(offering => (
                    <DropdownMenuCheckboxItem
                      key={offering}
                      checked={filters.freeOfferings.includes(offering)}
                      onCheckedChange={(checked) => handleFreeOfferingChange(offering, checked)}
                    >
                      {freeOfferingLabels[offering] || offering}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Rating Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-32">
                    Rating
                    {getActiveFilterCount('rating') > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {filters.ratings.min}-{filters.ratings.max}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-4 bg-white border shadow-lg">
                  <Label className="text-sm font-medium mb-3 block">
                    Rating ({filters.ratings.min} - {filters.ratings.max})
                  </Label>
                  <div className="px-2">
                    <Slider
                      value={[filters.ratings.min, filters.ratings.max]}
                      onValueChange={handleRatingChange}
                      max={5}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Access Type Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="min-w-32">
                    Access Type
                    {getActiveFilterCount('accessType') > 0 && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {filters.isPro === true ? 'Pro' : 'Free'}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white border shadow-lg">
                  <DropdownMenuCheckboxItem
                    checked={filters.isPro === false}
                    onCheckedChange={(checked) => 
                      handleProStatusChange(checked ? false : null)
                    }
                  >
                    Free Tools Only
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.isPro === true}
                    onCheckedChange={(checked) => 
                      handleProStatusChange(checked ? true : null)
                    }
                  >
                    Pro Tools Only
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.isPro === null}
                    onCheckedChange={(checked) => 
                      handleProStatusChange(checked ? null : filters.isPro)
                    }
                  >
                    All Tools
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
