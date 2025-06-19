
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Briefcase, Camera, UserCheck, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { TrendingToolsSection } from "@/components/TrendingToolsSection";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

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
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
            Discover AI Tools for
            <span className="block text-purple-600">Everything You Do</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            From school projects to business tasks, find the perfect AI tools and prompts to boost your productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-lg px-8 py-6">
              <Link to="/tools">Explore AI Tools</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
              <Link to="/prompts">Browse Prompt Packs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
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

      {/* Trending Tools Section */}
      <TrendingToolsSection />

      {/* CTA Section - Only show if user is not signed in */}
      {!session && (
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Supercharge Your Work with AI?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who are already using AI to boost their productivity and creativity.
            </p>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Index;
