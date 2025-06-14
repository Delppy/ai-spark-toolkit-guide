
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import ProfileUserInfo from "@/components/ProfileUserInfo";
import ProfilePreferences from "@/components/ProfilePreferences";
import ProfileFavorites from "@/components/ProfileFavorites";
import ProfileActivity from "@/components/ProfileActivity";
import ProfileModal from "@/components/ProfileModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type ProfileRow = Tables<"profiles">;

const defaultPrefs = {
  notifications: true,
  darkMode: false,
  language: "English",
};

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [activeSheet, setActiveSheet] = useState<null | "favorites" | "activity" | "preferences">(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user and profile
  useEffect(() => {
    let ignore = false;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!ignore && !session) {
        navigate("/login", { replace: true });
        return;
      }
      if (!ignore && session?.user) {
        setUser(session.user);
        setEmail(session.user.email ?? "");
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (!ignore && !error && data) {
          setProfile(data as ProfileRow);
        }
      }
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
      .single();
    if (!error && data) setProfile(data as ProfileRow);
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
      setEditing(false);
      setLoading(false);
      await refreshProfile();
      return;
    }
    setEditing(false);
    setLoading(false);
  };

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

  // Preference handler
  const handlePrefsChange = (p: typeof prefs) => {
    setPrefs(p);
    // Here you can sync to supabase (not implemented in demo)
  };

  if (!user || !profile) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[80vh]">Loading...</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="w-full max-w-md mx-auto min-h-[80vh]">
        <Tabs defaultValue="main" className="pt-6 w-full animate-fade-in">
          <TabsList className="w-full grid grid-cols-3 mb-7">
            <TabsTrigger value="main" className="w-full">Profile</TabsTrigger>
            <TabsTrigger value="settings" className="w-full">Settings</TabsTrigger>
            <TabsTrigger value="legal" className="w-full">Account</TabsTrigger>
          </TabsList>

          {/* Main profile */}
          <TabsContent value="main" className="space-y-4">
            <ProfileUserInfo
              profile={profile}
              email={email}
              editing={editing}
              loading={loading}
              setEditing={setEditing}
              setEmail={setEmail}
              handleSave={handleSave}
              handleLogout={handleLogout}
              handlePhotoUpload={handlePhotoUpload}
              user={user}
            />
            <div className="flex flex-col gap-3 mt-8">
              <Button
                onClick={() => setActiveSheet("favorites")}
                variant="secondary"
                className="w-full shadow-sm"
              >
                Favorites
              </Button>
              <Button
                onClick={() => setActiveSheet("activity")}
                variant="secondary"
                className="w-full shadow-sm"
              >
                Activity History
              </Button>
            </div>
          </TabsContent>
          {/* Settings */}
          <TabsContent value="settings" className="space-y-4">
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
          </TabsContent>
          {/* Account / legal */}
          <TabsContent value="legal">
            <div className="space-y-4">
              <Button className="w-full" variant="outline">Privacy Policy</Button>
              <Button className="w-full" variant="outline">Terms of Service</Button>
              <Button className="w-full" variant="destructive">Delete Account</Button>
            </div>
          </TabsContent>
        </Tabs>
        {/* Popups for modular navigation */}
        <ProfileModal open={activeSheet === "favorites"} setOpen={o => setActiveSheet(o ? "favorites" : null)}>
          <ProfileFavorites />
        </ProfileModal>
        <ProfileModal open={activeSheet === "activity"} setOpen={o => setActiveSheet(o ? "activity" : null)}>
          <ProfileActivity />
        </ProfileModal>
        <ProfileModal open={activeSheet === "preferences"} setOpen={o => setActiveSheet(o ? "preferences" : null)}>
          <ProfilePreferences preferences={prefs} setPreferences={handlePrefsChange} />
        </ProfileModal>
      </div>
    </Layout>
  );
};

export default Profile;
