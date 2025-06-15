
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Badge } from "@/components/ui/badge";
import { Star, Crown } from "lucide-react";
import { Link } from "react-router-dom";

type ProfileSettingsTabProps = {
  setActiveSheet: (sheet: "preferences" | "help" | null) => void;
};

const ProfileSettingsTab = ({ setActiveSheet }: ProfileSettingsTabProps) => {
  const { toast } = useToast();
  const { user } = useUserPreferences();
  const subscriptionStatus = useSubscription(user?.id);

  const handleCancelSubscription = () => {
    toast({
      title: "Coming soon",
      description: "Subscription cancellation coming soon.",
    });
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
              <Badge variant="premium" className="text-base py-2 px-4">
                <Crown className="w-5 h-5 mr-2" />
                Premium Member
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
            >
              Cancel Subscription
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
              Upgrade to unlock all Pro features
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-blue-600">
              <Link to="/pricing">
                <Star className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettingsTab;
