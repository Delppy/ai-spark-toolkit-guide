
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AITool, PromptPack } from '@/data/aiTools';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from "@/integrations/supabase/types";
import type { Session, User } from "@supabase/supabase-js";

type ProfileRow = Tables<"profiles">;

interface UserPreferences {
  favorites: string[];
  recentlyViewed: string[];
  preferredFreeOffering: string[];
  sortPreference: 'name' | 'rating' | 'users' | 'recent';
}

interface UserContextType {
  id: string;
  email?: string;
  name?: string;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  user: UserContextType | null;
  profile: ProfileRow | null;
  session: Session | null;
  loading: boolean;
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

  const [user, setUser] = useState<UserContextType | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateUserState = (newSession: Session | null) => {
      setSession(newSession);
      
      if (!newSession?.user) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      // Defer Supabase calls to prevent deadlocks, following best practices.
      setTimeout(async () => {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .maybeSingle();

          if (profileData) {
            setProfile(profileData as ProfileRow);
          }

          setUser({
            id: newSession.user.id,
            email: newSession.user.email,
            name: profileData?.name || newSession.user.user_metadata?.name,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback to user data without profile if the call fails
          setProfile(null);
          setUser({
            id: newSession.user.id,
            email: newSession.user.email,
            name: newSession.user.user_metadata?.name,
          });
        } finally {
          setLoading(false);
        }
      }, 0);
    };

    let isInitialized = false;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Prevent duplicate calls during initialization
      if (!isInitialized) {
        isInitialized = true;
      }
      updateUserState(session);
    });

    // THEN check for existing session - only once
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isInitialized) {
        isInitialized = true;
        updateUserState(session);
      }
    });

    return () => {
      subscription?.unsubscribe();
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
      session,
      loading,
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
