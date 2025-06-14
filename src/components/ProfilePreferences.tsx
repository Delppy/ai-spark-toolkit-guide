
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languages } from "@/utils/languages";

type ProfilePreferencesProps = {
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
  setPreferences: (prefs: any) => void;
};

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
          <Select
            value={preferences.language}
            onValueChange={value => setPreferences({ ...preferences, language: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {languages.map(lang => (
                <SelectItem value={lang} key={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePreferences;
