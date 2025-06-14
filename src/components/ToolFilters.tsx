
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterOptions } from '@/hooks/useToolFiltering';
import { Filter, X, ChevronDown } from 'lucide-react';

interface ToolFiltersProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: any) => void;
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

  const freeOfferingLabels: Record<string, string> = {
    'free': 'Completely Free',
    'free_trial': 'Free Trial',
    'free_credits': 'Free Credits',
    'freemium': 'Freemium'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Categories */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Categories</Label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => {
                          const newCategories = checked
                            ? [...filters.categories, category]
                            : filters.categories.filter(c => c !== category);
                          onFilterChange('categories', newCategories);
                        }}
                      />
                      <Label htmlFor={category} className="text-sm">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Offerings */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Free Access</Label>
                <div className="space-y-2">
                  {freeOfferings.map(offering => (
                    <div key={offering} className="flex items-center space-x-2">
                      <Checkbox
                        id={offering}
                        checked={filters.freeOfferings.includes(offering)}
                        onCheckedChange={(checked) => {
                          const newOfferings = checked
                            ? [...filters.freeOfferings, offering]
                            : filters.freeOfferings.filter(o => o !== offering);
                          onFilterChange('freeOfferings', newOfferings);
                        }}
                      />
                      <Label htmlFor={offering} className="text-sm">
                        {freeOfferingLabels[offering] || offering}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Range */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Rating ({filters.ratings.min} - {filters.ratings.max})
                </Label>
                <div className="px-2">
                  <Slider
                    value={[filters.ratings.min, filters.ratings.max]}
                    onValueChange={(value) => 
                      onFilterChange('ratings', { min: value[0], max: value[1] })
                    }
                    max={5}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Pro Status */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Access Type</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="free-tools"
                      checked={filters.isPro === false}
                      onCheckedChange={(checked) => 
                        onFilterChange('isPro', checked ? false : null)
                      }
                    />
                    <Label htmlFor="free-tools" className="text-sm">
                      Free Tools Only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pro-tools"
                      checked={filters.isPro === true}
                      onCheckedChange={(checked) => 
                        onFilterChange('isPro', checked ? true : null)
                      }
                    />
                    <Label htmlFor="pro-tools" className="text-sm">
                      Pro Tools Only
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
