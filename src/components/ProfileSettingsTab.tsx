
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useFreeAccess } from "@/hooks/useFreeAccess";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Badge } from "@/components/ui/badge";
import { Star, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

type ProfileSettingsTabProps = {
  setActiveSheet: (sheet: "preferences" | "help" | null) => void;
};

const ProfileSettingsTab = ({ setActiveSheet }: ProfileSettingsTabProps) => {
  const { toast } = useToast();
  const { user } = useUserPreferences();
  const { isPro, subscriptionStatus } = useFreeAccess();
  const [cancelling, setCancelling] = useState(false);

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
        <div className="space-y-4">
          <div className={`flex items-center justify-center p-4 rounded-lg border ${
            isPro 
              ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200" 
              : "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
          }`}>
            <Badge variant="secondary" className="text-base py-2 px-4">
              {isPro ? (
                <>
                  <Star className="w-5 h-5 mr-2" />
                  Pro Plan
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Free Plan
                </>
              )}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 text-center">
            {isPro 
              ? "You have access to all Pro features!"
              : "Upgrade to Pro for unlimited access to all features."
            }
          </p>
          {!isPro && (
            <Link to="/pricing" className="block">
              <Button className="w-full">
                Upgrade to Pro
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsTab;
