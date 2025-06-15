import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, Filter, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { ToolCard } from "@/components/ToolCard";
import { ToolFilters } from "@/components/ToolFilters";
import { ToolSorting } from "@/components/ToolSorting";
import { useToolFiltering } from "@/hooks/useToolFiltering";
import { dataManager } from "@/data/dataManager";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

const CategoryPDF = () => {
  const navigate = useNavigate();
  const { user, favoriteTools, addFavorite, removeFavorite } = useUserPreferences();
  const pdfData = dataManager.getCategoryData('pdf');
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
  } = useToolFiltering(pdfData.aiTools);

  const subcategories = [
    {
      name: "PDF Editing",
      description: "Tools for editing, converting, and manipulating PDF files",
      icon: "✏️",
      count: pdfData.aiTools.filter(tool => tool.category === "PDF Editing").length
    },
    {
      name: "PDF Analysis",
      description: "AI-powered analysis, summarization, and Q&A with PDFs",
      icon: "🔍",
      count: pdfData.aiTools.filter(tool => tool.category === "PDF Analysis").length
    },
    {
      name: "PDF Creation",
      description: "Generate and create PDFs with AI assistance",
      icon: "📄",
      count: pdfData.aiTools.filter(tool => tool.category === "PDF Creation").length
    },
    {
      name: "PDF Security",
      description: "Digital signatures, collaboration, and security tools",
      icon: "🔒",
      count: pdfData.aiTools.filter(tool => tool.category === "PDF Security").length
    }
  ];

  const handleFavoriteClick = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to save favorites");
      navigate("/login");
      return;
    }
    
    if (favoriteTools.includes(toolId)) {
      removeFavorite(toolId);
      toast.success("Removed from favorites");
    } else {
      addFavorite(toolId);
      toast.success("Added to favorites");
    }
  };

  const handleToolClick = (toolId: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubcategoryClick = (subcategoryName: string) => {
    // Clear existing filters and set the category filter
    clearFilters();
    updateFilter({ categories: [subcategoryName] });
    
    // Scroll to the tools section
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    toast.success(`Showing ${subcategoryName} tools`);
  };

  const isFavorite = (toolId: string) => {
    return favoriteTools.includes(toolId);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              PDF AI Tools
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Comprehensive collection of AI-powered PDF tools for editing, analysis, creation, and security. 
              From simple conversions to advanced document intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="text-sm">
                <Zap className="w-4 h-4 mr-1" />
                {pdfData.aiTools.length} Tools Available
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {pdfData.aiTools.filter(tool => tool.freeOffering === 'free').length} Completely Free
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {pdfData.aiTools.filter(tool => tool.freeOffering === 'freemium').length} Freemium Options
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
          PDF Tool Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {subcategories.map((subcategory) => (
            <Card 
              key={subcategory.name} 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleSubcategoryClick(subcategory.name)}
            >
              <CardHeader className="text-center">
                <div className="text-3xl mb-3">{subcategory.icon}</div>
                <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
                  {subcategory.name}
                </CardTitle>
                <Badge variant="outline" className="w-fit mx-auto">
                  {subcategory.count} tools
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {subcategory.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="tools-section" className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search PDF tools..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter({ searchTerm: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <ToolFilters
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          categories={getUniqueCategories()}
          freeOfferings={getUniqueFreeOfferings()}
          hasActiveFilters={hasActiveFilters}
        />

        <ToolSorting
          sort={sort}
          onSortChange={updateSort}
          totalResults={totalResults}
        />

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

        {filteredAndSortedTools.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No PDF tools found</h3>
            <p className="text-slate-500 mb-4">
              Try adjusting your search criteria or filters
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default CategoryPDF;
