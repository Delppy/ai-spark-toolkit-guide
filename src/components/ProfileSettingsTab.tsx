
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ProfileSettingsTabProps = {
  setActiveSheet: (sheet: "preferences" | null) => void;
};

const ProfileSettingsTab = ({ setActiveSheet }: ProfileSettingsTabProps) => {
  const { toast } = useToast();

  const handleUpgrade = () => {
    toast({
      title: "Coming soon",
      description: "Subscription upgrades coming soon.",
    });
  };

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
      <div className="mt-8 border-t pt-6">
        <div className="font-semibold mb-3">Subscription</div>
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600"
          >
            Upgrade Subscription
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancelSubscription}
            className="w-full"
          >
            Cancel Subscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsTab;
