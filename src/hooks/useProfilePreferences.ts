
import { useState } from "react";
import { useTheme } from "next-themes";

const defaultPrefs = {
  notifications: true,
  darkMode: true,
  language: "English",
};

export const useProfilePreferences = () => {
  const { theme } = useTheme();
  const [prefs, setPrefs] = useState({
    ...defaultPrefs,
    darkMode: theme === 'dark' || defaultPrefs.darkMode
  });

  const handlePrefsChange = (p: typeof prefs) => {
    setPrefs(p);
    // Here you can sync to supabase (not implemented in demo)
  };

  return {
    prefs,
    handlePrefsChange,
  };
};
