
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

type ProfileRow = Tables<"profiles">;

export const useProfile = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, profile, loading: checkingProfile } = useUserPreferences();
  const { toast } = useToast();

  // Update local state when profile changes
  useEffect(() => {
    if (profile) {
      setEmail(profile.email || "");
      setName(profile.name || "");
      setBio(profile.bio || "");
      setCountry(profile.country || "");
    } else if (user) {
      setEmail(user.email || "");
      setName("");
      setBio("");
      setCountry("");
    }
  }, [profile, user]);

  const refreshProfile = async () => {
    if (!user?.id) return;
    const { data, error } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    if (!error && data) {
      // The profile will be updated via UserPreferencesContext
      // Update local form state with fresh data
      setEmail(data.email || "");
      setName(data.name || "");
      setBio(data.bio || "");
      setCountry(data.country || "");
      return data;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out.",
      variant: "default",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user?.id) {
      setLoading(false);
      return;
    }

    // Handle auth email update if email field changed
    if (email && user && email !== user.email) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      toast({
        title: "Email updated",
        description: "Please check your new email for confirmation.",
        variant: "default",
      });
    }

    // Update name, bio, country in profiles table if changed
    if (
      (profile?.name !== name) ||
      (profile?.bio !== bio) ||
      (profile?.country !== country) ||
      (profile?.email !== email)
    ) {
      const { error } = await (supabase as any)
        .from("profiles")
        .update({
          name,
          bio,
          country,
          email,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) {
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    setEditing(false);
    setLoading(false);
    await refreshProfile();
  };

  const handlePhotoUpload = async (publicUrl: string) => {
    if (!user?.id) return;
    const { error } = await (supabase as any)
      .from("profiles")
      .update({ photo_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) {
      toast({
        title: "Photo update failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    await refreshProfile();
  };

  return {
    user,
    profile,
    email,
    setEmail,
    name,
    setName,
    bio,
    setBio,
    country,
    setCountry,
    editing,
    setEditing,
    loading,
    checkingProfile,
    handleLogout,
    handleSave,
    handlePhotoUpload,
  };
};
