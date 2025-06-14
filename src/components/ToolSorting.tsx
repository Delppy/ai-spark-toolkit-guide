
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SortOptions } from '@/hooks/useToolFiltering';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface ToolSortingProps {
  sort: SortOptions;
  onSortChange: (field: SortOptions['field'], direction?: SortOptions['direction']) => void;
  totalResults: number;
}

export const ToolSorting: React.FC<ToolSortingProps> = ({
  sort,
  onSortChange,
  totalResults
}) => {
  const sortOptions = [
    { field: 'rating' as const, label: 'Rating' },
    { field: 'name' as const, label: 'Name' },
    { field: 'users' as const, label: 'Popularity' },
    { field: 'category' as const, label: 'Category' }
  ];

  const getSortIcon = () => {
    if (sort.direction === 'asc') return <ArrowUp className="w-4 h-4" />;
    if (sort.direction === 'desc') return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4" />;
  };

  const currentSortLabel = sortOptions.find(option => option.field === sort.field)?.label || 'Rating';

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Badge variant="outline" className="text-sm">
          {totalResults} {totalResults === 1 ? 'tool' : 'tools'} found
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-slate-600">Sort by:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <span>{currentSortLabel}</span>
              {getSortIcon()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map(option => (
              <DropdownMenuItem
                key={option.field}
                onClick={() => onSortChange(option.field)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option.label}</span>
                  {sort.field === option.field && (
                    <div className="ml-2">
                      {sort.direction === 'asc' ? 
                        <ArrowUp className="w-3 h-3" /> : 
                        <ArrowDown className="w-3 h-3" />
                      }
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
