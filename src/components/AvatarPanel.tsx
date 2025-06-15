
import React from "react";
import ProfilePhotoUploader from "@/components/ProfilePhotoUploader";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

type AvatarPanelProps = {
  userId: string;
  photoUrl: string | null;
  onUpload: (url: string) => void;
  isPro: boolean;
};

const AvatarPanel: React.FC<AvatarPanelProps> = ({
  userId,
  photoUrl,
  onUpload,
  isPro,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  // Function to open Stripe customer portal for subscription management
  const handleOpenCustomerPortal = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Call the 'customer-portal' edge function
      const res = await fetch("/functions/v1/customer-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Supabase client will attach the auth token, but you may need to implement this depending on deployment (this is a placeholder)
        },
        credentials: "include"
      });
      const data = await res.json();
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        toast({
          title: "Unable to open subscription management",
          description: data?.error || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Couldn't open Stripe portal. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <ProfilePhotoUploader
        userId={userId}
        photoUrl={photoUrl}
        onUpload={onUpload}
      />
      {/* Pro User Badge indicator */}
      {isPro && (
        <div
          className={
            "mt-1 flex items-center gap-1 text-xs px-3 py-1 pt-1 shadow border-0 cursor-pointer active:scale-95 transition-transform"
          }
          title="Manage / Cancel Subscription"
          onClick={handleOpenCustomerPortal}
          tabIndex={0}
          role="button"
          style={{ outline: "none" }}
        >
          <Badge
            variant="premium"
            className={`flex items-center gap-1 text-xs px-3 py-1 pt-1 border-0 ${loading ? "opacity-70 pointer-events-none" : "hover:brightness-110"}`}
          >
            <Crown className="w-4 h-4 mr-1" />
            {loading ? (
              <span className="ml-1">Opening Portal...</span>
            ) : (
              <span>Premium</span>
            )}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default AvatarPanel;
