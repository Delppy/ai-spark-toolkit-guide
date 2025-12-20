
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Briefcase, Camera, UserCheck, FileText, ChevronRight, Grid3X3, Zap, Star, Crown } from "lucide-react";
import { Link } from "react-router-dom";

import { TrendingToolsSection } from "@/components/TrendingToolsSection";
import { ToolCard } from "@/components/ToolCard";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { ToolComparison } from "@/components/ToolComparison";
import { dataManager } from "@/data/dataManager";
import { useToolFiltering } from "@/hooks/useToolFiltering";
import { toast } from "sonner";
import { useProGate } from "@/hooks/useProGate";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

const Index = () => {
  const [showResults, setShowResults] = useState(false);

  const { user, session, toggleFavorite, isFavorite: isToolFavorite } = useUserPreferences();
  const userId = user?.id || null;
  const { isPro, proGate } = useProGate();

  const allTools = dataManager.getAllAITools();
  const allPromptPacks = dataManager.getAllPromptPacks();
  const {
    filteredAndSortedTools,
    updateFilter,
  } = useToolFiltering(allTools);

  const handleSearch = (searchTerm: string) => {
    updateFilter({ searchTerm });
    setShowResults(searchTerm.length > 0);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    console.log('Selected suggestion:', suggestion);
  };

  const handleFavoriteClick = async (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!session?.user?.id) {
      toast.error("Please log in to save favorites");
      return;
    }

    toggleFavorite(toolId);
  };

  const handleToolClick = (toolId: string, url: string) => {
    console.log(`Navigating to ${url} for tool ${toolId}`);
    window.open(url, "_blank");
  };

  const isFavorite = (toolId: string) => isToolFavorite(toolId);

  const categories = [
    {
      id: "school",
      title: "School & Education",
      icon: BookOpen,
      description: "AI tools for students and learners",
      color: "bg-primary",
      tools: ["ChatGPT for Essays", "Quillbot Summarizer", "Grammarly AI"],
      route: "/school"
    },
    {
      id: "business",
      title: "Business & Work",
      icon: Briefcase,
      description: "Professional AI tools for productivity",
      color: "bg-secondary",
      tools: ["Jasper AI", "Copy.ai", "Notion AI"],
      route: "/business"
    },
    {
      id: "content",
      title: "Content Creation",
      icon: Camera,
      description: "AI for social media and content",
      color: "bg-accent",
      tools: ["Canva AI", "Midjourney", "Runway ML"],
      route: "/content"
    },
    {
      id: "career",
      title: "Career & Jobs",
      icon: UserCheck,
      description: "AI tools for job search and CV writing",
      color: "bg-primary",
      tools: ["Resume.io", "LinkedIn AI", "InterviewBuddy"],
      route: "/career"
    },
    {
      id: "pdf",
      title: "PDF Tools",
      icon: FileText,
      description: "AI-powered PDF editing and analysis",
      color: "bg-secondary",
      tools: ["ChatPDF", "TinyWOW", "DocuSign"],
      route: "/pdf"
    }
  ];

  return (
    <>
      {/* Advanced Search Section */}
      <section className="container mx-auto px-4 py-8">
        <AdvancedSearch
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          placeholder="Search AI tools by name, category, or features..."
        />
      </section>

      {/* Search Results */}
      {showResults && (
        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Search Results ({filteredAndSortedTools.length} found)
            </h3>
            {filteredAndSortedTools.length === 0 ? (
              <div className="text-center py-12">
                <h4 className="text-xl font-semibold text-foreground mb-2">No tools found</h4>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedTools.slice(0, 12).map((tool) => (
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
            {filteredAndSortedTools.length > 12 && (
              <div className="text-center mt-8">
                <Button asChild variant="outline" size="lg">
                  <Link to="/tools">View All Results</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Hero Section - Only show when not searching */}
      {!showResults && (
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Discover the Best AI Tools
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Explore thousands of AI-powered tools to boost your productivity, creativity, and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/tools">
                  <Grid3X3 className="w-5 h-5 mr-2" />
                  Explore All Tools
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/prompts">Browse Prompt Packs</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid - Only show when not searching */}
      {!showResults && (
        <section className="container mx-auto px-4 py-12">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            Find AI Tools by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.id} to={category.route}>
                  <Card className="group cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-border overflow-hidden">
                    <div className={`${category.color} p-6 text-primary-foreground relative`}>
                      <IconComponent className="w-8 h-8 mb-4 relative z-10" />
                      <h4 className="text-xl font-semibold mb-2 relative z-10">{category.title}</h4>
                      <p className="text-primary-foreground/80 text-sm relative z-10">{category.description}</p>
                    </div>
                    <CardContent className="p-6 bg-card">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground mb-3">Popular tools:</p>
                        {category.tools.slice(0, 2).map((tool, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-foreground">{tool}</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* AI Prompt Packs Section - Only show when not searching */}
      {!showResults && (
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Professional AI Prompt Packs
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Access curated collections of high-converting prompts designed by experts to boost your productivity.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="text-lg px-8 py-6"
              >
                <Link to="/prompts">
                  <Crown className="w-5 h-5 mr-2" />
                  {isPro ? "Browse All Prompt Packs" : "Explore Prompt Packs"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                <Link to="/prompts">View All Prompts</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Trending Tools Section - Only show when not searching */}
      {!showResults && <TrendingToolsSection />}

      {/* Tool Comparison Component */}
      <ToolComparison tools={allTools} />

      {/* CTA Section - Only show if user is not signed in and not searching */}
      {!session && !showResults && (
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Supercharge Your Work with AI?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who are already using AI to boost their productivity and creativity.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-background text-foreground hover:bg-muted text-lg px-8 py-6">
                <Link to="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
      </section>
    )}
  </>
  );
};

export default Index;