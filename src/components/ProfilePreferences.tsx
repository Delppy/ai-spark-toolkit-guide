
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

type ProfilePreferencesProps = {
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
  setPreferences: (prefs: any) => void;
};

const languages = ["English", "Español", "Deutsch", "Français"];

const ProfilePreferences: React.FC<ProfilePreferencesProps> = ({ preferences, setPreferences }) => {
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold">App Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span>Receive notifications</span>
          <Switch
            checked={preferences.notifications}
            onCheckedChange={v => setPreferences({ ...preferences, notifications: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Dark mode</span>
          <Switch
            checked={preferences.darkMode}
            onCheckedChange={v => setPreferences({ ...preferences, darkMode: v })}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Language</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={preferences.language}
            onChange={e => setPreferences({ ...preferences, language: e.target.value })}
          >
            {languages.map(lang => (
              <option value={lang} key={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePreferences;
