
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type ProfileRow = Tables<"profiles">;

export const useProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user and profile, create profile if missing
  useEffect(() => {
    let ignore = false;
    setCheckingProfile(true);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (ignore) return;
      if (!session) {
        navigate("/login", { replace: true });
        return;
      }
      setUser(session.user);
      setEmail(session.user.email ?? "");
      // Try to get the profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (ignore) return;

      if (!error && !data) {
        // Profile does not exist: create it
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: session.user.id,
            email: session.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
        if (insertError) {
          toast({
            title: "Profile creation failed",
            description: insertError.message,
            variant: "destructive",
          });
          setCheckingProfile(false);
          return;
        }
        // Fetch the newly created profile
        const { data: newProfile, error: errorAfterInsert } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        if (!errorAfterInsert && newProfile) {
          setProfile(newProfile as ProfileRow);
          setName(newProfile.name ?? "");
          setBio(newProfile.bio ?? "");
          setCountry(newProfile.country ?? "");
        }
      } else if (!error && data) {
        setProfile(data as ProfileRow);
        setName(data.name ?? "");
        setBio(data.bio ?? "");
        setCountry(data.country ?? "");
      }
      setCheckingProfile(false);
    });
    return () => {
      ignore = true;
    };
  }, [navigate]);

  const refreshProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    if (!error && data) {
      setProfile(data as ProfileRow);
      setName(data.name ?? "");
      setBio(data.bio ?? "");
      setCountry(data.country ?? "");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out.",
      variant: "default",
    });
    navigate("/login");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
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
      setUser({ ...user, email });
    }

    // Update name, bio, country in profiles table if changed
    if (
      (profile?.name !== name) ||
      (profile?.bio !== bio) ||
      (profile?.country !== country) ||
      (profile?.email !== email)
    ) {
      const { error } = await supabase
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
    if (!user) return;
    const { error } = await supabase
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
