
import { Button } from "@/components/ui/button";
import ProfileUserInfo from "@/components/ProfileUserInfo";

type ProfileMainTabProps = {
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
  setActiveSheet: (sheet: "favorites" | "activity" | null) => void;
};

const ProfileMainTab = ({
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
  setActiveSheet,
}: ProfileMainTabProps) => {
  return (
    <div className="space-y-4">
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
        name={name}
        bio={bio}
        country={country}
        setName={setName}
        setBio={setBio}
        setCountry={setCountry}
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
    </div>
  );
};

export default ProfileMainTab;
