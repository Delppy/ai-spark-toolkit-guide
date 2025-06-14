
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileModal from "@/components/ProfileModal";
import ProfileFavorites from "@/components/ProfileFavorites";
import ProfileActivity from "@/components/ProfileActivity";
import ProfilePreferences from "@/components/ProfilePreferences";
import ProfileHelpCenter from "@/components/ProfileHelpCenter";
import ProfileMainTab from "@/components/ProfileMainTab";
import ProfileSettingsTab from "@/components/ProfileSettingsTab";
import ProfileAccountTab from "@/components/ProfileAccountTab";

type ProfileTabsProps = {
  profile: any;
  email: string;
  editing: boolean;
  loading: boolean;
  setEditing: (editing: boolean) => void;
  setEmail: (email: string) => void;
  handleSave: (e: React.FormEvent) => void;
  handleLogout: () => void;
  handlePhotoUpload: (url: string) => void;
  user: any;
  name: string;
  bio: string;
  country: string;
  setName: (s: string) => void;
  setBio: (s: string) => void;
  setCountry: (s: string) => void;
  prefs: any;
  handlePrefsChange: (prefs: any) => void;
};

const ProfileTabs = ({
  profile,
  email,
  editing,
  loading,
  setEditing,
  setEmail,
  handleSave,
  handleLogout,
  handlePhotoUpload,
  user,
  name,
  bio,
  country,
  setName,
  setBio,
  setCountry,
  prefs,
  handlePrefsChange,
}: ProfileTabsProps) => {
  const [activeSheet, setActiveSheet] = useState<null | "favorites" | "activity" | "preferences" | "help">(null);

  return (
    <>
      <Tabs defaultValue="main" className="pt-6 w-full animate-fade-in">
        <TabsList className="w-full grid grid-cols-3 mb-7">
          <TabsTrigger value="main" className="w-full">Profile</TabsTrigger>
          <TabsTrigger value="settings" className="w-full">Settings</TabsTrigger>
          <TabsTrigger value="legal" className="w-full">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="space-y-4">
          <ProfileMainTab
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
            name={name}
            bio={bio}
            country={country}
            setName={setName}
            setBio={setBio}
            setCountry={setCountry}
            setActiveSheet={setActiveSheet}
          />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <ProfileSettingsTab setActiveSheet={setActiveSheet} />
        </TabsContent>
        
        <TabsContent value="legal">
          <ProfileAccountTab />
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
      <ProfileModal open={activeSheet === "help"} setOpen={o => setActiveSheet(o ? "help" : null)}>
        <ProfileHelpCenter />
      </ProfileModal>
    </>
  );
};

export default ProfileTabs;
