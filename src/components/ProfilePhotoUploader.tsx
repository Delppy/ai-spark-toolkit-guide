
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

    console.log("Starting file upload for user:", userId);
    setUploading(true);

    try {
      // File path (one per user, overwrite)
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log("Uploading to path:", filePath);

      // Remove existing files first
      const { data: existingFiles } = await supabase.storage
        .from(BUCKET)
        .list(userId, { limit: 100 });

      if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map(file => `${userId}/${file.name}`);
        await supabase.storage.from(BUCKET).remove(filesToRemove);
        console.log("Removed existing files:", filesToRemove);
      }

      // Upload new file
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast({
          title: "Photo upload failed",
          description: uploadError.message,
          variant: "destructive",
        });
        return;
      }

      // Get public URL
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      console.log("Public URL generated:", data.publicUrl);

      if (data?.publicUrl) {
        onUpload(data.publicUrl);
        toast({
          title: "Profile photo updated",
          description: "Your new profile photo has been uploaded.",
        });
      }
    } catch (error) {
      console.error("Unexpected error during upload:", error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="w-20 h-20 mb-2">
        <AvatarImage 
          src={photoUrl || undefined} 
          alt="Profile photo"
          onError={(e) => {
            console.log("Image failed to load:", photoUrl);
            e.currentTarget.style.display = 'none';
          }}
          onLoad={() => {
            console.log("Image loaded successfully:", photoUrl);
          }}
        />
        <AvatarFallback>
          <span role="img" aria-label="avatar">
            👤
          </span>
        </AvatarFallback>
      </Avatar>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
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
