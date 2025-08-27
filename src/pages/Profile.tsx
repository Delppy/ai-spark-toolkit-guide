
import React, { useState } from "react";
import ProfileTabs from "@/components/ProfileTabs";
import { useProfile } from "@/hooks/useProfile";
import { useProfilePreferences } from "@/hooks/useProfilePreferences";

const Profile = () => {
  const {
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
  } = useProfile();

  const { prefs, handlePrefsChange } = useProfilePreferences();

  if (checkingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">Loading...</div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">Couldn't find a profile for this user.</div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-[80vh]">
        <ProfileTabs
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
          prefs={prefs}
          handlePrefsChange={handlePrefsChange}
      />
    </div>
  );
};

export default Profile;
