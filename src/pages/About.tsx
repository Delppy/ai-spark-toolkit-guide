import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, BookOpen, Briefcase, Laptop, Mail, Users, Rocket, Star } from "lucide-react";

const About = () => {
  const handleEmailContact = () => {
    window.open("mailto:support@aitouse.app", "_blank");
  };

  const handleWebsiteVisit = () => {
    window.open("https://www.aitouse.app", "_blank");
  };

  const handleRateApp = () => {
    // This would typically open the app store rating page
    window.open("https://www.aitouse.app/rate", "_blank");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      About AiToUse
                    </h1>
                    <p className="text-lg text-slate-600">Your shortcut to AI mastery</p>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* What is AiToUse */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-slate-800">What is AiToUse?</h2>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <p className="text-slate-700 leading-relaxed">
                    AiToUse is your shortcut to getting value from AI fast.
                    Whether you're a student, content creator, freelancer, or professional, 
                    AiToUse gives you ready-made, actionable AI prompts that help you do more, 
                    think less, and create faster.
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Who It's For */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-slate-800">🎯 Who It's For</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold">Students & learners 🧑🏽‍🎓</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold">Creators & influencers 🎥</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">Freelancers & solopreneurs 💼</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2">
                      <Laptop className="w-5 h-5 text-purple-500" />
                      <span className="font-semibold">Professionals & job seekers 💻</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* What You Get */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Rocket className="w-6 h-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-slate-800">🚀 What You Get</h2>
                </div>
                <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-slate-800">200+ AI prompt templates across 4 categories:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <BookOpen className="w-4 h-4" />
                        <span>📚 School & Education</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Briefcase className="w-4 h-4" />
                        <span>🏢 Business & Work</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Star className="w-4 h-4" />
                        <span>🎬 Content Creation</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Laptop className="w-4 h-4" />
                        <span>👔 Career & Jobs</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-slate-700">✨ Bookmarking & Favorites</p>
                    <p className="text-slate-700">📋 Copy-ready, zero-guesswork prompt design</p>
                    <p className="text-slate-700">🤖 Works with ChatGPT, Gemini, Claude & more</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Version Info */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">🛠 Version Info</h2>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-slate-700"><strong>Version:</strong> 1.0.0</p>
                    <p className="text-slate-700"><strong>Last Updated:</strong> June 2025</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Contact & Support */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-6 h-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-slate-800">📩 Contact & Support</h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-700 mb-2"><strong>Email:</strong> support@aitouse.app</p>
                    <p className="text-slate-700"><strong>Website:</strong> www.aitouse.app</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleWebsiteVisit} className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                      Visit Website
                    </Button>
                    <Button onClick={handleEmailContact} variant="outline">
                      Email Us
                    </Button>
                    <Button onClick={handleRateApp} variant="outline">
                      Rate App
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Built With Love */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">🤝 Built With Love</h2>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg text-center">
                  <p className="text-slate-700 leading-relaxed">
                    Built by a team of creators who believe AI should work for you, not confuse you.
                  </p>
                </div>
              </div>

              <div className="pb-8"></div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
};

export default About;
