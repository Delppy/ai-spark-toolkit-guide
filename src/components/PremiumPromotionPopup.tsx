import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Crown, Users, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

export const PremiumPromotionPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { subscription } = useUserPreferences();

  useEffect(() => {
    // Don't show popup to PRO users
    if (subscription.isPro) {
      return;
    }

    // Check if user has seen the popup in this session
    const seenPopup = sessionStorage.getItem("premium-popup-seen");
    
    if (!seenPopup) {
      // Show popup after 3-5 seconds (randomly between 3000-5000ms)
      const delay = Math.floor(Math.random() * 2000) + 3000;
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("premium-popup-seen", "true");
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [subscription.isPro]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 border border-border overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-1.5 bg-background/80 backdrop-blur hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header with solid color */}
        <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
          <div className="relative z-10">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0 mb-4">
              <Crown className="w-3 h-3 mr-1" />
              Premium Feature
            </Badge>
            
            <DialogTitle className="text-3xl md:text-4xl font-bold mb-3 text-primary-foreground">
              Turn Ideas into Perfect Prompts
            </DialogTitle>
            
            <p className="text-lg text-primary-foreground/90 mb-0">
              Type your rough idea. Get a professional prompt. It's that simple.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-background">
          {/* Example Transformation */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              See It in Action
            </p>
            
            <div className="space-y-4">
              {/* Input */}
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-xs font-bold flex-shrink-0 border border-border">
                      IN
                    </div>
                    <p className="text-sm text-muted-foreground italic pt-1">
                      "I want to make a travel blog post"
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>

              {/* Output */}
              <Card className="bg-primary/5 border-primary/20 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
                      OUT
                    </div>
                    <p className="text-sm font-medium pt-1">
                      "Write a 3-paragraph blog post about traveling to Italy with an inspiring tone."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-4">
            <Button 
              asChild
              size="lg"
              className="w-full shadow-sm"
            >
              <Link to="/prompt-refinery" onClick={handleClose}>
                <Star className="w-4 h-4 mr-2" />
                Try Premium Now
              </Link>
            </Button>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Join 5,700+ creators already using AiToUse Premium</span>
            </div>

            {/* Additional info */}
            <p className="text-xs text-muted-foreground">
              No credit card required to try • Instant results
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};