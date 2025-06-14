
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProfilePhotoUploader from "@/components/ProfilePhotoUploader";
import React from "react";

type ProfileUserInfoProps = {
  profile: {
    id: string;
    photo_url: string | null;
    email: string | null;
    name?: string | null;
    bio?: string | null;
    country?: string | null;
  };
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
};

const countries = [
  "",
  "United States", "Canada", "United Kingdom", "Germany", "France", "India", "Australia", "Nigeria",
  "Brazil", "China", "Japan", "South Africa", "Other"
];

const ProfileUserInfo: React.FC<ProfileUserInfoProps> = ({
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
}) => (
  <Card className="w-full animate-fade-in">
    <CardHeader>
      <CardTitle className="text-xl text-center font-bold">Account Info</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center mb-4">
        <ProfilePhotoUploader
          userId={profile.id}
          photoUrl={profile.photo_url}
          onUpload={handlePhotoUpload}
        />
      </div>
      <form onSubmit={handleSave} className="space-y-4" aria-label="profile edit form">
        <div>
          <label htmlFor="profile-name" className="block font-medium mb-1">
            Name
          </label>
          <Input
            id="profile-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={!editing}
            className={!editing ? "bg-gray-100" : ""}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="block font-medium mb-1">
            Email
          </label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={!editing}
            className={!editing ? "bg-gray-100" : ""}
          />
        </div>
        <div>
          <label htmlFor="profile-bio" className="block font-medium mb-1">
            Bio
          </label>
          <Input
            id="profile-bio"
            type="text"
            value={bio}
            onChange={e => setBio(e.target.value)}
            disabled={!editing}
            className={!editing ? "bg-gray-100" : ""}
            placeholder="Short bio"
          />
        </div>
        <div>
          <label htmlFor="profile-country" className="block font-medium mb-1">
            Country
          </label>
          <select
            id="profile-country"
            value={country}
            onChange={e => setCountry(e.target.value)}
            disabled={!editing}
            className={`border rounded px-2 py-1 w-full ${!editing ? "bg-gray-100" : ""}`}
          >
            {countries.map(option => (
              <option key={option} value={option}>{option === "" ? "Select country" : option}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mt-4">
          {!editing ? (
            <Button type="button" variant="outline" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditing(false);
                  setName(profile.name ?? "");
                  setBio(profile.bio ?? "");
                  setCountry(profile.country ?? "");
                  setEmail(user.email);
                }}
              >
                Cancel
              </Button>
            </>
          )}
          <Button type="button" variant="destructive" className="ml-auto" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
);

export default ProfileUserInfo;
