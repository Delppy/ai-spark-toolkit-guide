
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Badge } from "@/components/ui/badge";
import { Star, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

type ProfileSettingsTabProps = {
  setActiveSheet: (sheet: "preferences" | "help" | null) => void;
};

const ProfileSettingsTab = ({ setActiveSheet }: ProfileSettingsTabProps) => {
  const { toast } = useToast();
  const { user } = useUserPreferences();
  const subscriptionStatus = useSubscription(user?.id);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    if (cancelling) return;
    
    setCancelling(true);
    try {
      const { data, error } = await supabase.functions.invoke('paystack-cancel-subscription');
      
      if (error) {
        throw error;
      }

      toast({
        title: "Subscription Cancelled",
        description: `Your subscription has been cancelled. You'll continue to have Pro access until ${new Date(data.expires_at).toLocaleDateString()}.`,
      });

      // Refresh subscription status
      subscriptionStatus.refresh();
      
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setActiveSheet("preferences")}
        className="w-full"
        variant="outline"
      >
        Preferences
      </Button>
      <Button
        onClick={() => setActiveSheet("help")}
        className="w-full"
        variant="outline"
      >
        Help Center
      </Button>
      
      <div className="mt-8 border-t pt-6">
        <div className="font-semibold mb-3">Subscription Status</div>
        
        {subscriptionStatus.isPro ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <Badge variant="secondary" className="text-base py-2 px-4">
                <Crown className="w-5 h-5 mr-2" />
                Free Member
              </Badge>
            </div>
            <p className="text-sm text-gray-600 text-center">
              You have full access to all Pro features
            </p>
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancelSubscription}
              className="w-full"
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Cancel Subscription"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Badge variant="secondary" className="text-base py-2 px-4">
                Free Plan
              </Badge>
            </div>
            <p className="text-sm text-gray-600 text-center">
              All features are now free!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettingsTab;
