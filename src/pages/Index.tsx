
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Briefcase, Camera, UserCheck, FileText, ChevronRight, Sparkles, Zap, Star, Crown } from "lucide-react";
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
      color: "bg-gradient-to-br from-primary to-secondary",
      tools: ["ChatGPT for Essays", "Quillbot Summarizer", "Grammarly AI"],
      route: "/school"
    },
    {
      id: "business",
      title: "Business & Work",
      icon: Briefcase,
      description: "Professional AI tools for productivity",
      color: "bg-gradient-to-br from-secondary to-accent",
      tools: ["Jasper AI", "Copy.ai", "Notion AI"],
      route: "/business"
    },
    {
      id: "content",
      title: "Content Creation",
      icon: Camera,
      description: "AI for social media and content",
      color: "bg-gradient-to-br from-accent to-primary",
      tools: ["Canva AI", "Midjourney", "Runway ML"],
      route: "/content"
    },
    {
      id: "career",
      title: "Career & Jobs",
      icon: UserCheck,
      description: "AI tools for job search and CV writing",
      color: "bg-gradient-to-br from-primary to-accent",
      tools: ["Resume.io", "LinkedIn AI", "InterviewBuddy"],
      route: "/career"
    },
    {
      id: "pdf",
      title: "PDF Tools",
      icon: FileText,
      description: "AI-powered PDF editing and analysis",
      color: "bg-gradient-to-br from-secondary to-primary",
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
            <h3 className="text-2xl font-bold mb-6 text-primary">
              Search Results ({filteredAndSortedTools.length} found)
            </h3>
            {filteredAndSortedTools.length === 0 ? (
              <div className="text-center py-12">
                <h4 className="text-xl font-semibold text-primary mb-2">No tools found</h4>
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
          <div className="max-w-5xl mx-auto">
            {/* Premium Badge */}
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 px-4 py-2 text-sm font-medium">
                <Crown className="w-4 h-4 mr-1.5" />
                Premium Feature
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Turn Your Ideas into Perfect AI Prompts — Instantly.
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto leading-relaxed">
              Just type any rough thought and watch it transform into a professional, ready-to-use prompt for ChatGPT, Claude, Midjourney, and more.
            </p>

            {/* Visual Transformation Example */}
            <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-6 md:p-10 mb-10 border border-primary/10">
              <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                {/* Before */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your Idea</span>
                  </div>
                  <Card className="bg-background/80 backdrop-blur border-primary/20">
                    <CardContent className="p-5">
                      <p className="text-muted-foreground italic text-sm md:text-base">
                        "write me something about marketing"
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Arrow */}
                <div className="flex justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center transform rotate-0 md:rotate-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* After */}
                <div className="space-y-3 md:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-semibold text-white">
                      2
                    </div>
                    <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase tracking-wide">Premium Prompt</span>
                  </div>
                  <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 shadow-lg">
                    <CardContent className="p-5">
                      <p className="text-foreground font-medium text-sm md:text-base leading-relaxed">
                        "Act as a senior digital marketing strategist. Create a comprehensive content marketing plan for a B2B SaaS company targeting mid-sized enterprises. Include channel strategy, content pillars, KPIs, and a 90-day execution timeline."
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity text-white text-lg px-10 py-7 rounded-xl shadow-xl hover:shadow-2xl"
              >
                <Link to="/prompt-refinery" className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Try Premium
                </Link>
              </Button>
              
              {/* Social Proof */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  ))}
                </div>
                <span className="font-medium">Join 5,700+ users saving hours of prompt writing</span>
              </div>
            </div>

            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pt-12 border-t border-border/50">
              <Button asChild variant="outline" size="lg" className="text-base px-6 py-6">
                <Link to="/tools">Explore AI Tools</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-6 py-6">
                <Link to="/prompts">Browse Prompt Packs</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid - Only show when not searching */}
      {!showResults && (
        <section className="container mx-auto px-4 py-12">
          <h3 className="text-3xl font-bold text-center mb-12 text-primary">
            Find AI Tools by Category
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.id} to={category.route}>
                  <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 overflow-hidden">
                    <div className={`${category.color} p-6 text-white relative`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
                      <IconComponent className="w-8 h-8 mb-4 relative z-10" />
                      <h4 className="text-xl font-semibold mb-2 relative z-10">{category.title}</h4>
                      <p className="text-white/90 text-sm relative z-10">{category.description}</p>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground mb-3">Popular tools:</p>
                        {category.tools.slice(0, 2).map((tool, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-foreground">{tool}</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
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
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Professional AI Prompt Packs
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Access curated collections of high-converting prompts designed by experts to boost your productivity.
            </p>
            {!isPro && (
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-secondary/10 to-accent/10 px-4 py-2 rounded-full border border-secondary/20">
                <Zap className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">Try 3 prompts free • Upgrade for unlimited access</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg px-8 py-6"
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
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Supercharge Your Work with AI?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who are already using AI to boost their productivity and creativity.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-muted text-lg px-8 py-6">
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
