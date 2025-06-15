
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AITool, PromptPack } from '@/data/aiTools';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from "@/integrations/supabase/types";

type ProfileRow = Tables<"profiles">;

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
  profile: ProfileRow | null;
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

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    const updateUserState = (sessionUser: any | null) => {
      if (!sessionUser) {
        setUser(null);
        setProfile(null);
        return;
      }
      
      // Defer Supabase calls to prevent deadlocks, following best practices.
      setTimeout(async () => {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionUser.id)
            .single();

          if (profileData) {
            setProfile(profileData as ProfileRow);
          }

          setUser({
            id: sessionUser.id,
            email: sessionUser.email,
            name: profileData?.name || sessionUser.user_metadata?.name,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback to user data without profile if the call fails
          setProfile(null);
          setUser({
            id: sessionUser.id,
            email: sessionUser.email,
            name: sessionUser.user_metadata?.name,
          });
        }
      }, 0);
    };

    // Initialize user state on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUserState(session?.user ?? null);
    });

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUserState(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

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
      profile,
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
