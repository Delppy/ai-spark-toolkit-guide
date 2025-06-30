
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Briefcase, Camera, UserCheck, FileText, ChevronRight, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { TrendingToolsSection } from "@/components/TrendingToolsSection";
import { ToolCard } from "@/components/ToolCard";
import { supabase } from "@/integrations/supabase/client";
import { dataManager } from "@/data/dataManager";
import { useToolFiltering } from "@/hooks/useToolFiltering";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const allTools = dataManager.getAllAITools();
  const {
    filteredAndSortedTools,
    updateFilter,
  } = useToolFiltering(allTools);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateFilter({ searchTerm: value });
    setShowResults(value.length > 0);
  };

  const clearSearch = () => {
    setSearchTerm("");
    updateFilter({ searchTerm: "" });
    setShowResults(false);
  };

  const handleFavoriteClick = async (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!session?.user?.id) {
      toast.error("Please log in to save favorites");
      return;
    }

    try {
      const isFavorited = favorites.includes(toolId);
      
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('item_id', toolId);
        
        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== toolId));
        toast.success("Removed from favorites");
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: session.user.id,
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

  const categories = [
    {
      id: "school",
      title: "School & Education",
      icon: BookOpen,
      description: "AI tools for students and learners",
      color: "bg-gradient-to-br from-blue-500 to-purple-600",
      tools: ["ChatGPT for Essays", "Quillbot Summarizer", "Grammarly AI"],
      route: "/school"
    },
    {
      id: "business",
      title: "Business & Work",
      icon: Briefcase,
      description: "Professional AI tools for productivity",
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      tools: ["Jasper AI", "Copy.ai", "Notion AI"],
      route: "/business"
    },
    {
      id: "content",
      title: "Content Creation",
      icon: Camera,
      description: "AI for social media and content",
      color: "bg-gradient-to-br from-pink-500 to-rose-600",
      tools: ["Canva AI", "Midjourney", "Runway ML"],
      route: "/content"
    },
    {
      id: "career",
      title: "Career & Jobs",
      icon: UserCheck,
      description: "AI tools for job search and CV writing",
      color: "bg-gradient-to-br from-orange-500 to-amber-600",
      tools: ["Resume.io", "LinkedIn AI", "InterviewBuddy"],
      route: "/career"
    },
    {
      id: "pdf",
      title: "PDF Tools",
      icon: FileText,
      description: "AI-powered PDF editing and analysis",
      color: "bg-gradient-to-br from-red-500 to-pink-600",
      tools: ["ChatPDF", "TinyWOW", "DocuSign"],
      route: "/pdf"
    }
  ];

  return (
    <Layout>
      {/* Search Section - Moved to Top */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search AI tools by name, category, or features..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-12 py-4 text-lg border-2 border-slate-200 focus:border-purple-500 rounded-xl shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Search Results */}
      {showResults && (
        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-slate-900">
              Search Results ({filteredAndSortedTools.length} found)
            </h3>
            {filteredAndSortedTools.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-slate-600 mb-2">No tools found</h4>
                <p className="text-slate-500">Try adjusting your search terms</p>
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
        <section className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              Discover AI Tools for
              <span className="block text-purple-600">Everything You Do</span>
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              From school projects to business tasks, find the perfect AI tools and prompts to boost your productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-lg px-8 py-6">
                <Link to="/tools">Explore AI Tools</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                <Link to="/prompts">Browse Prompt Packs</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid - Only show when not searching */}
      {!showResults && (
        <section className="container mx-auto px-4 py-12">
          <h3 className="text-3xl font-bold text-center mb-12 text-slate-900">
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
                        <p className="text-sm text-slate-600 mb-3">Popular tools:</p>
                        {category.tools.slice(0, 2).map((tool, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">{tool}</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
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

      {/* Trending Tools Section - Only show when not searching */}
      {!showResults && <TrendingToolsSection />}

      {/* CTA Section - Only show if user is not signed in and not searching */}
      {!session && !showResults && (
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Supercharge Your Work with AI?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who are already using AI to boost their productivity and creativity.
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
                <Link to="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Index;
