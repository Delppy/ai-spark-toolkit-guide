
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Star, Users, Copy, Heart, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CategorySchool = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const aiTools = [
    {
      name: "ChatGPT",
      category: "Essay Writing",
      description: "Get help writing essays, research papers, and assignments with AI assistance",
      rating: 4.8,
      users: "100M+",
      isPro: false,
      url: "https://chat.openai.com",
      features: ["Essay Writing", "Research Help", "Citation Formatting"]
    },
    {
      name: "Quillbot",
      category: "Paraphrasing",
      description: "Paraphrase and rewrite text to avoid plagiarism and improve clarity",
      rating: 4.6,
      users: "50M+",
      isPro: true,
      url: "https://quillbot.com",
      features: ["Paraphrasing", "Grammar Check", "Summarizer"]
    },
    {
      name: "Grammarly",
      category: "Grammar Check",
      description: "Check grammar, spelling, and improve your writing style",
      rating: 4.7,
      users: "30M+",
      isPro: false,
      url: "https://grammarly.com",
      features: ["Grammar Check", "Style Suggestions", "Plagiarism Detection"]
    },
    {
      name: "Wolfram Alpha",
      category: "Math & Science",
      description: "Solve complex math problems and get step-by-step solutions",
      rating: 4.5,
      users: "5M+",
      isPro: true,
      url: "https://wolframalpha.com",
      features: ["Math Solver", "Science Calculator", "Data Analysis"]
    },
    {
      name: "Notion AI",
      category: "Note Taking",
      description: "AI-powered note-taking and study organization",
      rating: 4.4,
      users: "20M+",
      isPro: true,
      url: "https://notion.so",
      features: ["Smart Notes", "Study Plans", "Research Organization"]
    },
    {
      name: "Consensus",
      category: "Research",
      description: "Find scientific papers and research evidence using AI",
      rating: 4.3,
      users: "1M+",
      isPro: false,
      url: "https://consensus.app",
      features: ["Research Papers", "Citation Finder", "Evidence Search"]
    }
  ];

  const promptPacks = [
    {
      title: "Essay Writing Prompts",
      description: "Complete prompts for writing different types of essays",
      prompts: 15,
      category: "Writing",
      isPro: false,
      examples: [
        "Write a 5-paragraph essay about [TOPIC] with clear thesis statement and supporting evidence",
        "Create an argumentative essay outline for [POSITION] with counterarguments",
        "Generate a conclusion paragraph that summarizes [MAIN_POINTS] and restates thesis"
      ]
    },
    {
      title: "Research & Citation Prompts",
      description: "Get help with research methodology and proper citations",
      prompts: 12,
      category: "Research",
      isPro: true,
      examples: [
        "Find 5 credible sources about [TOPIC] and explain why they're reliable",
        "Create APA citations for [SOURCE_TYPE] about [SUBJECT]",
        "Summarize this research paper in 200 words: [PASTE_CONTENT]"
      ]
    },
    {
      title: "Study & Exam Prep",
      description: "Prompts to help you study more effectively",
      prompts: 18,
      category: "Study",
      isPro: false,
      examples: [
        "Create flashcards for [SUBJECT] covering [SPECIFIC_TOPICS]",
        "Generate practice questions for [EXAM_TYPE] on [SUBJECT]",
        "Explain [COMPLEX_CONCEPT] in simple terms with examples"
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
            Discover AI tools and prompts to help with essays, research, studying, and academic projects.
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

      {/* AI Tools Grid */}
      <section className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6 text-slate-900">AI Tools for School</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTools.map((tool, index) => (
            <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Student Prompt Packs</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {promptPacks.map((pack, index) => (
            <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
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
