
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AITool, PromptPack } from '@/data/aiTools';

interface UserPreferences {
  favorites: string[];
  recentlyViewed: string[];
  preferredFreeOffering: string[];
  sortPreference: 'name' | 'rating' | 'users' | 'recent';
}

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  user: User | null;
  favoriteTools: string[];
  toggleFavorite: (toolId: string) => void;
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
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

  // Mock user for now - in a real app this would come from authentication
  const [user] = useState<User | null>(null);

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

  const addFavorite = (toolId: string) => {
    setPreferences(prev => ({
      ...prev,
      favorites: prev.favorites.includes(toolId) 
        ? prev.favorites 
        : [...prev.favorites, toolId]
    }));
  };

  const removeFavorite = (toolId: string) => {
    setPreferences(prev => ({
      ...prev,
      favorites: prev.favorites.filter(id => id !== toolId)
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
      user,
      favoriteTools: preferences.favorites,
      toggleFavorite,
      addFavorite,
      removeFavorite,
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
