
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Camera, Search, Star, Users, Copy, Heart, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CategoryContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const aiTools = [
    {
      name: "Midjourney",
      category: "Image Generation",
      description: "Create stunning AI-generated artwork and visuals for content",
      rating: 4.8,
      users: "15M+",
      isPro: true,
      url: "https://midjourney.com",
      features: ["AI Art", "High Quality", "Creative Styles"]
    },
    {
      name: "Canva AI",
      category: "Design",
      description: "AI-powered design tools for social media graphics and content",
      rating: 4.7,
      users: "100M+",
      isPro: false,
      url: "https://canva.com",
      features: ["Templates", "Auto-resize", "Brand Kit"]
    },
    {
      name: "Runway ML",
      category: "Video Editing",
      description: "AI video editing tools for content creators",
      rating: 4.5,
      users: "5M+",
      isPro: true,
      url: "https://runwayml.com",
      features: ["Video AI", "Effects", "Background Removal"]
    },
    {
      name: "DALL-E 3",
      category: "Image Generation",
      description: "Advanced AI image generation from OpenAI",
      rating: 4.6,
      users: "50M+",
      isPro: true,
      url: "https://openai.com/dall-e-3",
      features: ["Text to Image", "High Resolution", "Creative Control"]
    },
    {
      name: "Luma AI",
      category: "3D Content",
      description: "Create 3D content and interactive experiences with AI",
      rating: 4.4,
      users: "2M+",
      isPro: true,
      url: "https://lumalabs.ai",
      features: ["3D Models", "AR Content", "Interactive Media"]
    },
    {
      name: "Pictory",
      category: "Video Creation",
      description: "Turn text into engaging videos automatically",
      rating: 4.3,
      users: "3M+",
      isPro: true,
      url: "https://pictory.ai",
      features: ["Text to Video", "Auto Captions", "Stock Footage"]
    }
  ];

  const promptPacks = [
    {
      title: "Social Media Captions",
      description: "Engaging captions for Instagram, TikTok, and other platforms",
      prompts: 30,
      category: "Social Media",
      isPro: false,
      examples: [
        "Create 5 Instagram captions for [PRODUCT/SERVICE] that encourage engagement",
        "Write a viral TikTok caption for [TREND/TOPIC] with relevant hashtags",
        "Generate LinkedIn post captions for [PROFESSIONAL_TOPIC] that spark discussion"
      ]
    },
    {
      title: "Content Ideas Generator",
      description: "Fresh content ideas for videos, posts, and stories",
      prompts: 25,
      category: "Ideas",
      isPro: false,
      examples: [
        "Generate 10 YouTube video ideas for [NICHE] that will get high engagement",
        "Create a month's worth of Instagram story ideas for [BRAND/TOPIC]",
        "Suggest 5 trending content formats for [PLATFORM] in [INDUSTRY]"
      ]
    },
    {
      title: "Video Script Templates",
      description: "Complete video scripts for different content types",
      prompts: 20,
      category: "Video",
      isPro: true,
      examples: [
        "Write a 60-second TikTok script about [TOPIC] with hook, content, and CTA",
        "Create a YouTube intro script for [CHANNEL_TYPE] that builds anticipation",
        "Generate a product demo script for [PRODUCT] highlighting key benefits"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50">
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
                <Camera className="w-6 h-6 text-pink-600" />
                <h1 className="text-xl font-bold text-slate-900">Content Creation</h1>
              </div>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-pink-500 to-rose-600">
              Get Pro
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-900 to-rose-900 bg-clip-text text-transparent">
            AI Tools for Creators
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Create amazing content with AI tools for social media, videos, graphics, and creative projects.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search content creation tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Creative AI Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTools.map((tool, index) => (
            <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-pink-600 transition-colors flex items-center">
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
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Content Creation Prompts</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {promptPacks.map((pack, index) => (
            <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg group-hover:text-pink-600 transition-colors">
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

export default CategoryContent;
