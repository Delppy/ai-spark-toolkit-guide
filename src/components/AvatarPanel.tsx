
import React from "react";
import ProfilePhotoUploader from "@/components/ProfilePhotoUploader";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

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
  console.log("[AvatarPanel] userId:", userId, "isPro:", isPro);
  return (
    <div className="flex flex-col items-center mb-4">
      <ProfilePhotoUploader
        userId={userId}
        photoUrl={photoUrl}
        onUpload={onUpload}
      />
      {/* Pro User Badge indicator */}
      {isPro && (
        <Badge
          variant="premium"
          className="mt-1 flex items-center gap-1 text-xs px-3 py-1 pt-1 shadow border-0"
        >
          <Crown className="w-4 h-4 mr-1" />
          Premium
        </Badge>
      )}
    </div>
  );
};

export default AvatarPanel;
