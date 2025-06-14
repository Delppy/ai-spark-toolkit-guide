
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const defaultPrefs = {
  notifications: true,
  darkMode: true,
  language: "English",
};

export const useProfilePreferences = () => {
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState({
    ...defaultPrefs,
    darkMode: theme === 'dark' || defaultPrefs.darkMode
  });

  useEffect(() => {
    if (prefs.darkMode) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [prefs.darkMode, setTheme]);

  const handlePrefsChange = (p: typeof prefs) => {
    setPrefs(p);
    // Here you can sync to supabase (not implemented in demo)
  };

  return {
    prefs,
    handlePrefsChange,
  };
};
