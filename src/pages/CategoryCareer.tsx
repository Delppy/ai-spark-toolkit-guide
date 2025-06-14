
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserCheck, Search, Star, Users, Copy, Heart, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CategoryCareer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const aiTools = [
    {
      name: "Resume.io",
      category: "Resume Builder",
      description: "AI-powered resume builder with professional templates",
      rating: 4.6,
      users: "10M+",
      isPro: false,
      url: "https://resume.io",
      features: ["ATS-Friendly", "Templates", "AI Writing"]
    },
    {
      name: "Zety",
      category: "CV Creation",
      description: "Create professional CVs and cover letters with AI assistance",
      rating: 4.5,
      users: "8M+",
      isPro: true,
      url: "https://zety.com",
      features: ["CV Builder", "Cover Letters", "Career Advice"]
    },
    {
      name: "InterviewBuddy",
      category: "Interview Prep",
      description: "AI-powered interview practice and feedback",
      rating: 4.4,
      users: "2M+",
      isPro: true,
      url: "https://interviewbuddy.com",
      features: ["Mock Interviews", "AI Feedback", "Question Bank"]
    },
    {
      name: "LinkedIn AI",
      category: "Networking",
      description: "AI tools for LinkedIn optimization and networking",
      rating: 4.7,
      users: "50M+",
      isPro: false,
      url: "https://linkedin.com",
      features: ["Profile Optimization", "Connection Messages", "Post Ideas"]
    },
    {
      name: "Jobscan",
      category: "ATS Optimization",
      description: "Optimize your resume for Applicant Tracking Systems",
      rating: 4.3,
      users: "5M+",
      isPro: true,
      url: "https://jobscan.co",
      features: ["ATS Scanner", "Keyword Optimization", "Match Score"]
    },
    {
      name: "Glassdoor AI",
      category: "Job Search",
      description: "AI-powered job recommendations and company insights",
      rating: 4.2,
      users: "20M+",
      isPro: false,
      url: "https://glassdoor.com",
      features: ["Job Matching", "Salary Insights", "Company Reviews"]
    }
  ];

  const promptPacks = [
    {
      title: "Resume & CV Writing",
      description: "Professional prompts for crafting standout resumes",
      prompts: 25,
      category: "Resume",
      isPro: false,
      examples: [
        "Write a compelling professional summary for [ROLE] with [X] years experience in [INDUSTRY]",
        "Create achievement-focused bullet points for [JOB_TITLE] highlighting [SPECIFIC_ACCOMPLISHMENTS]",
        "Optimize this job description for ATS keywords: [PASTE_JOB_DESCRIPTION]"
      ]
    },
    {
      title: "Cover Letter Templates",
      description: "Persuasive cover letter prompts for various industries",
      prompts: 20,
      category: "Cover Letters",
      isPro: true,
      examples: [
        "Write a cover letter for [POSITION] at [COMPANY] highlighting [RELEVANT_SKILLS]",
        "Create an opening paragraph that grabs attention for [INDUSTRY] application",
        "Generate a closing paragraph with strong call-to-action for [JOB_TYPE]"
      ]
    },
    {
      title: "Interview Preparation",
      description: "Practice prompts for common interview scenarios",
      prompts: 30,
      category: "Interviews",
      isPro: false,
      examples: [
        "Prepare STAR method answers for [COMPETENCY] interview questions",
        "Create 5 thoughtful questions to ask interviewer for [ROLE] position",
        "Practice explaining career gap/transition for [SPECIFIC_SITUATION]"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
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
                <UserCheck className="w-6 h-6 text-orange-600" />
                <h1 className="text-xl font-bold text-slate-900">Career & Jobs</h1>
              </div>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-600">
              Get Pro
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-900 to-amber-900 bg-clip-text text-transparent">
            AI Tools for Career Success
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Land your dream job with AI tools for resume writing, interview prep, and career development.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search career AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="container mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Career Development AI Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTools.map((tool, index) => (
            <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-orange-600 transition-colors flex items-center">
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
        <h3 className="text-2xl font-bold mb-6 text-slate-900">Career Success Prompts</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {promptPacks.map((pack, index) => (
            <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">
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

export default CategoryCareer;
