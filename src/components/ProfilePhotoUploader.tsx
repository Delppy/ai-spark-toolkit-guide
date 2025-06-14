
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type ProfilePhotoUploaderProps = {
  userId: string;
  photoUrl: string | null;
  onUpload: (url: string) => void;
};

const BUCKET = "profile-photos";

const ProfilePhotoUploader = ({ userId, photoUrl, onUpload }: ProfilePhotoUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    // File path (one per user, overwrite)
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    // Remove existing file
    await supabase.storage.from(BUCKET).remove([`${userId}/avatar.png`, `${userId}/avatar.jpg`, `${userId}/avatar.jpeg`, `${userId}/avatar.webp`]);

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });
    if (uploadError) {
      toast({
        title: "Photo upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    if (data?.publicUrl) {
      onUpload(data.publicUrl);
      toast({
        title: "Profile photo updated",
        description: "Your new profile photo has been uploaded.",
      });
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="w-20 h-20 mb-2">
        <AvatarImage src={photoUrl || undefined} alt="Profile photo" />
        <AvatarFallback>
          <span role="img" aria-label="avatar">
            👤
          </span>
        </AvatarFallback>
      </Avatar>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
        aria-label="Upload profile photo"
      />
      <Button
        type="button"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mt-1"
      >
        {uploading ? "Uploading..." : "Change photo"}
      </Button>
    </div>
  );
};

export default ProfilePhotoUploader;
