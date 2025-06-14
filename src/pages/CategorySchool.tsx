
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Star, Users, Copy, Heart, ExternalLink, ArrowLeft, Gift, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { dataManager } from "@/data/dataManager";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useToolFiltering } from "@/hooks/useToolFiltering";
import { ToolFilters } from "@/components/ToolFilters";
import { ToolSorting } from "@/components/ToolSorting";

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

  const getFreeOfferingIcon = (offering: string) => {
    switch (offering) {
      case 'free':
        return <Gift className="w-3 h-3 text-green-600" />;
      case 'free_trial':
        return <Gift className="w-3 h-3 text-blue-600" />;
      case 'free_credits':
        return <Gift className="w-3 h-3 text-purple-600" />;
      case 'freemium':
        return <Gift className="w-3 h-3 text-orange-600" />;
      default:
        return null;
    }
  };

  const getFreeOfferingColor = (offering: string) => {
    switch (offering) {
      case 'free':
        return 'bg-green-100 text-green-800';
      case 'free_trial':
        return 'bg-blue-100 text-blue-800';
      case 'free_credits':
        return 'bg-purple-100 text-purple-800';
      case 'freemium':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-600">
              Get Pro
            </Button>
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
          totalResults={totalResults}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAndSortedTools.map((tool) => (
            <Card key={tool.id} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors flex items-center">
                      {tool.name}
                      {tool.isPro && (
                        <Badge className="ml-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs">
                          Pro
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {tool.category}
                      </Badge>
                      <Badge className={`text-xs flex items-center space-x-1 ${getFreeOfferingColor(tool.freeOffering)}`}>
                        {getFreeOfferingIcon(tool.freeOffering)}
                        <span>{tool.freeOffering.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="transition-opacity"
                    onClick={(e) => handleFavoriteClick(tool.id, e)}
                  >
                    {isFavorite(tool.id) ? (
                      <Bookmark className="w-4 h-4 fill-current text-blue-600" />
                    ) : (
                      <Heart className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-slate-600">
                  {tool.description}
                </CardDescription>
                
                <div className="mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 font-medium">
                    🎁 {tool.freeDetails}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {tool.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{tool.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{tool.users}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleToolClick(tool.id, tool.url)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Use Tool
                </Button>
              </CardContent>
            </Card>
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
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Student Prompt Packs</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {promptPacks.map((pack) => (
            <Card key={pack.id} className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                      {pack.title}
                      {pack.isPro && (
                        <Badge className="ml-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs">
                          Pro
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {pack.category}
                      </Badge>
                      <span className="text-sm text-slate-500">{pack.prompts} prompts</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {pack.description}
                </CardDescription>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">Example prompts:</p>
                  {pack.examples.slice(0, 2).map((example, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border">
                      <p className="text-sm text-slate-700 mb-2">{example}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(example)}
                        className="text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-4" variant={pack.isPro ? "default" : "outline"}>
                  {pack.isPro ? "Unlock with Pro" : "View All Prompts"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategorySchool;
