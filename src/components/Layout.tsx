import { Button } from "@/components/ui/button";
import AnimatedButton from "@/components/ui/animated-button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sparkles, Star, User, Settings, LogOut, Crown } from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";
import PageTransition from "./PageTransition";
import { useSubscription } from "@/hooks/useFreeAccess";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Badge } from "@/components/ui/badge";
import { NewAd } from "@/components/ads/NewAd";
import { ProfitableRateAd } from "@/components/ads/ProfitableRateAd";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import React from "react";

const Layout = () => {
  const location = useLocation();
  const { user, profile } = useUserPreferences();
  // Force reactivity on user?.id
  const subscriptionStatus = useSubscription(user?.id || null);
  console.log("[Layout] user:", user, "profile:", profile, "subscription:", {
    isPro: subscriptionStatus.isPro,
    premiumBadge: subscriptionStatus.premiumBadge,
    showRemoveAds: subscriptionStatus.showRemoveAds,
    status: subscriptionStatus.subscriptionStatus
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center transition-all duration-200 hover:shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AiToUse
              </h1>
            </Link>
            <div className="flex items-center space-x-2">
              {!user && location.pathname !== "/login" && location.pathname !== "/signup" && (
                <div className="flex items-center space-x-2">
                  <AnimatedButton asChild variant="ghost" size="sm">
                    <Link to="/login">Login</Link>
                  </AnimatedButton>
                  <AnimatedButton asChild variant="outline" size="sm">
                    <Link to="/signup">Sign Up</Link>
                  </AnimatedButton>
                </div>
              )}
              {!!user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={profile?.photo_url || ""} 
                          alt={profile?.name || user?.email || "Profile"} 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                          {profile?.name 
                            ? profile.name.charAt(0).toUpperCase()
                            : user?.email?.charAt(0).toUpperCase() || "U"
                          }
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center space-x-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center space-x-2 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {/* Subscription Status Badge */}
              {user && (
                <div className="ml-2">
                  {subscriptionStatus.isPro ? (
                    <Badge variant="secondary" className="py-1.5 px-3 flex items-center gap-1.5 bg-amber-50 text-amber-700 border-amber-200">
                      <Star className="w-4 h-4 text-amber-500" />
                      Pro
                    </Badge>
                  ) : (
                    <Link to="/pricing">
                      <Badge variant="outline" className="py-1.5 px-3 flex items-center gap-1.5 hover:bg-primary/10 cursor-pointer">
                        <Crown className="w-4 h-4 text-primary" />
                        Upgrade to Pro
                      </Badge>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className={`flex-grow ${subscriptionStatus.showRemoveAds ? 'pb-4' : ''}`}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      
      {/* Bottom Ad - only shows for non-Pro users */}
      <NewAd />
      <ProfitableRateAd />
      

      <footer className="bg-foreground text-background py-12 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="transition-all duration-200 hover:translate-y-[-2px]">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AiToUse</span>
              </div>
              <p className="text-muted-foreground">
                Discover and master AI tools for every aspect of your life.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/school" className="hover:text-white transition-all duration-200 hover:translate-x-1">School & Education</Link></li>
                <li><Link to="/business" className="hover:text-white transition-all duration-200 hover:translate-x-1">Business & Work</Link></li>
                <li><Link to="/content" className="hover:text-white transition-all duration-200 hover:translate-x-1">Content Creation</Link></li>
                <li><Link to="/career" className="hover:text-white transition-all duration-200 hover:translate-x-1">Career & Jobs</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/tools" className="hover:text-white transition-all duration-200 hover:translate-x-1">AI Tools</Link></li>
                <li><Link to="/favorites" className="hover:text-white transition-all duration-200 hover:translate-x-1">Favorites</Link></li>
                <li><Link to="/prompts" className="hover:text-white transition-all duration-200 hover:translate-x-1">Prompt Packs</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-all duration-200 hover:translate-x-1">Go Ad-Free</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="hover:text-white transition-all duration-200 hover:translate-x-1">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-all duration-200 hover:translate-x-1">Contact Us</Link></li>
                <li><Link to="/about" className="hover:text-white transition-all duration-200 hover:translate-x-1">About</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-all duration-200 hover:translate-x-1">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 AiToUse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;