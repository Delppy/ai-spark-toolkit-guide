import { Button } from "@/components/ui/button";
import AnimatedButton from "@/components/ui/animated-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "./PageTransition";
import type { Tables } from "@/integrations/supabase/types";
import type { Session } from "@supabase/supabase-js";
import { useSubscription } from "@/hooks/useSubscription";

type ProfileRow = Tables<"profiles">;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      const fetchProfile = async () => {
        try {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();

          if (error) {
            console.error("Error fetching profile:", error);
          } else if (profileData) {
            setProfile(profileData);
          }
        } catch (error) {
          console.error("Unexpected error fetching profile:", error);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [session]);

  const user = session?.user;
  const subscriptionStatus = useSubscription(user?.id || user?.email || undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AiToUse
              </h1>
            </Link>
            <div className="flex items-center space-x-2">
              {!user && location.pathname !== "/login" && (
                <AnimatedButton asChild variant="ghost" size="sm">
                  <Link to="/login">Login</Link>
                </AnimatedButton>
              )}
              {!!user && location.pathname !== "/profile" && (
                <AnimatedButton asChild variant="ghost" size="sm" className="p-1">
                  <Link to="/profile" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={profile?.photo_url || ""} 
                        alt={profile?.name || user?.email || "Profile"} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-sm">
                        {profile?.name 
                          ? profile.name.charAt(0).toUpperCase()
                          : user?.email?.charAt(0).toUpperCase() || "U"
                        }
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </AnimatedButton>
              )}
              {/* Only show Get Pro button if user is logged in and NOT Pro */}
              {user && !subscriptionStatus.isPro && (
                <AnimatedButton
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                >
                  <Link to="/pricing">Get Pro</Link>
                </AnimatedButton>
              )}
              {/* If Pro is enabled, show a "Pro" badge instead of Get Pro */}
              {user && subscriptionStatus.isPro && (
                <span className="ml-2 px-2 py-1 text-xs rounded-full font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow">
                  Pro
                </span>
              )}
              {/* For users not logged in, never show Pro button or badge */}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      <footer className="bg-slate-900 text-white py-12 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="transition-all duration-200 hover:translate-y-[-2px]">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AiToUse</span>
              </div>
              <p className="text-slate-400">
                Discover and master AI tools for every aspect of your life.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/school" className="hover:text-white transition-all duration-200 hover:translate-x-1">School & Education</Link></li>
                <li><Link to="/business" className="hover:text-white transition-all duration-200 hover:translate-x-1">Business & Work</Link></li>
                <li><Link to="/content" className="hover:text-white transition-all duration-200 hover:translate-x-1">Content Creation</Link></li>
                <li><Link to="/career" className="hover:text-white transition-all duration-200 hover:translate-x-1">Career & Jobs</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/tools" className="hover:text-white transition-all duration-200 hover:translate-x-1">AI Tools</Link></li>
                <li><Link to="/prompts" className="hover:text-white transition-all duration-200 hover:translate-x-1">Prompt Packs</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-all duration-200 hover:translate-x-1">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/help" className="hover:text-white transition-all duration-200 hover:translate-x-1">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-all duration-200 hover:translate-x-1">Contact Us</Link></li>
                <li><Link to="/about" className="hover:text-white transition-all duration-200 hover:translate-x-1">About</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-all duration-200 hover:translate-x-1">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 AiToUse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
