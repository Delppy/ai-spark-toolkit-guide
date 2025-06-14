
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Briefcase, Search, Star, Users, Copy, Heart, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CategoryBusiness = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const aiTools = [
    {
      name: "Jasper AI",
      category: "Content Writing",
      description: "Create high-quality marketing copy, emails, and business content",
      rating: 4.7,
      users: "5M+",
      isPro: true,
      url: "https://jasper.ai",
      features: ["Marketing Copy", "Email Templates", "Blog Posts"]
    },
    {
      name: "Copy.ai",
      category: "Copywriting",
      description: "Generate sales copy, product descriptions, and marketing materials",
      rating: 4.5,
      users: "3M+",
      isPro: false,
      url: "https://copy.ai",
      features: ["Sales Copy", "Product Descriptions", "Ad Copy"]
    },
    {
      name: "Gamma",
      category: "Presentations",
      description: "Create professional presentations and pitch decks with AI",
      rating: 4.6,
      users: "2M+",
      isPro: true,
      url: "https://gamma.app",
      features: ["Pitch Decks", "Reports", "Presentations"]
    },
    {
      name: "Tome",
      category: "Storytelling",
      description: "Build compelling business narratives and presentations",
      rating: 4.4,
      users: "1M+",
      isPro: true,
      url: "https://tome.app",
      features: ["Business Stories", "Pitch Narratives", "Visual Content"]
    },
    {
      name: "Krisp",
      category: "Meeting Assistant",
      description: "AI-powered noise cancellation and meeting transcription",
      rating: 4.8,
      users: "10M+",
      isPro: false,
      url: "https://krisp.ai",
      features: ["Noise Cancellation", "Transcription", "Meeting Notes"]
    },
    {
      name: "Otter.ai",
      category: "Transcription",
      description: "Record and transcribe meetings with AI-powered notes",
      rating: 4.3,
      users: "8M+",
      isPro: false,
      url: "https://otter.ai",
      features: ["Meeting Transcription", "Action Items", "Summaries"]
    }
  ];

  const promptPacks = [
    {
      title: "Business Email Templates",
      description: "Professional email prompts for various business scenarios",
      prompts: 20,
      category: "Communication",
      isPro: false,
      examples: [
        "Write a professional follow-up email after a meeting about [TOPIC]",
        "Create a cold outreach email for [PRODUCT/SERVICE] to [TARGET_AUDIENCE]",
        "Draft a polite decline email for [PROPOSAL/REQUEST] with alternative suggestions"
      ]
    },
    {
      title: "Marketing Copy Generator",
      description: "Create compelling marketing copy for different platforms",
      prompts: 25,
      category: "Marketing",
      isPro: true,
      examples: [
        "Create a landing page headline and subheading for [PRODUCT] targeting [AUDIENCE]",
        "Write 5 social media post variations for promoting [PRODUCT/SERVICE]",
        "Generate email subject lines for [CAMPAIGN_TYPE] with high open rates"
      ]
    },
    {
      title: "Pitch Deck & Presentation",
      description: "Structure and content prompts for business presentations",
      prompts: 15,
      category: "Presentations",
      isPro: true,
      examples: [
        "Create a 10-slide pitch deck outline for [BUSINESS_IDEA] targeting [INVESTORS]",
        "Write compelling problem and solution slides for [INDUSTRY] pain points",
        "Generate market size and opportunity slides for [PRODUCT_CATEGORY]"
      ]
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "The prompt has been copied to your clipboard.",
    });
  };

  const filteredTools = aiTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
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
                <Briefcase className="w-6 h-6 text-green-600" />
                <h1 className="text-xl font-bold text-slate-900">Business & Work</h1>
              </div>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600">
              Get Pro
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-900 to-emerald-900 bg-clip-text text-transparent">
            AI Tools for Business
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Boost your productivity with AI tools for marketing, presentations, communication, and business operations.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search business AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Professional AI Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTools.map((tool, index) => (
            <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-green-600 transition-colors flex items-center">
                      {tool.name}
                      {tool.isPro && (
                        <Badge className="ml-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs">
                          Pro
                        </Badge>
                      )}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-slate-600">
                  {tool.description}
                </CardDescription>
                
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
                  onClick={() => window.open(tool.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Use Tool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Prompt Packs */}
      <section className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Business Prompt Packs</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {promptPacks.map((pack, index) => (
            <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
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

export default CategoryBusiness;
