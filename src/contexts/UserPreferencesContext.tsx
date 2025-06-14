
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AITool, PromptPack } from '@/data/aiTools';

interface UserPreferences {
  favorites: string[];
  recentlyViewed: string[];
  preferredFreeOffering: string[];
  sortPreference: 'name' | 'rating' | 'users' | 'recent';
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  toggleFavorite: (toolId: string) => void;
  addToRecentlyViewed: (toolId: string) => void;
  setPreferredFreeOffering: (offerings: string[]) => void;
  setSortPreference: (sort: UserPreferences['sortPreference']) => void;
  isFavorite: (toolId: string) => boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    favorites: [],
    recentlyViewed: [],
    preferredFreeOffering: [],
    sortPreference: 'rating'
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const toggleFavorite = (toolId: string) => {
    setPreferences(prev => ({
      ...prev,
      favorites: prev.favorites.includes(toolId)
        ? prev.favorites.filter(id => id !== toolId)
        : [...prev.favorites, toolId]
    }));
  };

  const addToRecentlyViewed = (toolId: string) => {
    setPreferences(prev => ({
      ...prev,
      recentlyViewed: [toolId, ...prev.recentlyViewed.filter(id => id !== toolId)].slice(0, 10)
    }));
  };

  const setPreferredFreeOffering = (offerings: string[]) => {
    setPreferences(prev => ({ ...prev, preferredFreeOffering: offerings }));
  };

  const setSortPreference = (sort: UserPreferences['sortPreference']) => {
    setPreferences(prev => ({ ...prev, sortPreference: sort }));
  };

  const isFavorite = (toolId: string) => {
    return preferences.favorites.includes(toolId);
  };

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      toggleFavorite,
      addToRecentlyViewed,
      setPreferredFreeOffering,
      setSortPreference,
      isFavorite
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
