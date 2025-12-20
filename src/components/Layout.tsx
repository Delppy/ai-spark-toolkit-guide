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
import { Star, User, Settings, LogOut, Crown } from "lucide-react";
import logoImage from "@/assets/logo.png";
import { Link, useLocation, Outlet } from "react-router-dom";
import PageTransition from "./PageTransition";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Badge } from "@/components/ui/badge";
import { NewAd } from "@/components/ads/NewAd";
import { ProfitableRateAd } from "@/components/ads/ProfitableRateAd";
import { PopunderAd } from "@/components/ads/PopunderAd";
import { InterstitialAd } from "@/components/ads/InterstitialAd";
import { useAdManager } from "@/hooks/useAdManager";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import React from "react";


const Layout = () => {
  const location = useLocation();
  const { user, profile, loading, subscription } = useUserPreferences();
  
  // Initialize ad manager - it will handle all ad blocking for PRO users
  useAdManager();
  
  console.log("[Layout] user:", user, "profile:", profile, "subscription:", {
    isPro: subscription.isPro,
    premiumBadge: subscription.premiumBadge,
    showRemoveAds: subscription.showRemoveAds,
    status: subscription.subscriptionStatus
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    // Clear all persistent session data
    localStorage.removeItem('aitouse-user-authenticated');
    localStorage.removeItem('aitouse-last-login');
    localStorage.removeItem('aitouse-auth-token');
    
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully. You can sign back in anytime!");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <header className="bg-background border-b border-border sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-2 transition-all duration-200 hover:opacity-80"
            >
              <img src={logoImage} alt="AiToUse Logo" className="h-20 w-auto" />
            </Link>
            <div className="flex items-center space-x-2">
              {!loading && !user && location.pathname !== "/login" && location.pathname !== "/signup" && (
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
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {profile?.name 
                            ? profile.name.charAt(0).toUpperCase()
                            : user?.email?.charAt(0).toUpperCase() || "U"
                          }
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-popover border border-border">
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
                      className="flex items-center space-x-2 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
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
                  {subscription.isPro ? (
                    <Badge variant="secondary" className="py-1.5 px-3 flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20">
                      <Star className="w-4 h-4" />
                      Pro
                    </Badge>
                  ) : (
                    <Link to="/pricing">
                      <Badge variant="outline" className="py-1.5 px-3 flex items-center gap-1.5 hover:bg-muted cursor-pointer">
                        <Crown className="w-4 h-4 text-muted-foreground" />
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
      
      <main className={`flex-grow ${subscription.showRemoveAds ? 'pb-4' : ''}`}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      
      {/* Ad Components - only show for non-Pro users */}
      <NewAd />
      <ProfitableRateAd />
      <PopunderAd />
      <InterstitialAd />
      

      <footer className="bg-foreground text-background py-12 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="transition-all duration-200">
              <div className="flex items-center space-x-2 mb-4">
                <img src={logoImage} alt="AiToUse Logo" className="h-16 w-auto" />
              </div>
              <p className="text-muted-foreground">
                Discover and master AI tools for every aspect of your life.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/school" className="hover:text-background transition-colors">School & Education</Link></li>
                <li><Link to="/business" className="hover:text-background transition-colors">Business & Work</Link></li>
                <li><Link to="/content" className="hover:text-background transition-colors">Content Creation</Link></li>
                <li><Link to="/career" className="hover:text-background transition-colors">Career & Jobs</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/tools" className="hover:text-background transition-colors">AI Tools</Link></li>
                <li><Link to="/favorites" className="hover:text-background transition-colors">Favorites</Link></li>
                <li><Link to="/prompts" className="hover:text-background transition-colors">Prompt Packs</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="hover:text-background transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-background transition-colors">Contact Us</Link></li>
                <li><Link to="/about" className="hover:text-background transition-colors">About</Link></li>
                <li><Link to="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link></li>
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