
import { useState } from "react";

const defaultPrefs = {
  notifications: true,
  darkMode: false,
  language: "English",
};

export const useProfilePreferences = () => {
  const [prefs, setPrefs] = useState(defaultPrefs);

  const handlePrefsChange = (p: typeof prefs) => {
    setPrefs(p);
    // Here you can sync to supabase (not implemented in demo)
  };

  return {
    prefs,
    handlePrefsChange,
  };
};
