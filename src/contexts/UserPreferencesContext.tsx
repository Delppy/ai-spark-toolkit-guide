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

  // Single auth state listener to prevent multiple session checks
  useEffect(() => {
    let ignore = false;
    
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener FIRST to catch all changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (ignore) return;
        
        console.log('Auth state changed:', event, !!session);
        
        setSession(session);
        setLoading(true);
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || ''
          });
          
          // Only fetch profile if we have a session - use timeout to prevent auth loops
          setTimeout(async () => {
            if (ignore) return;
            
            try {
              const { data: profileData } = await (supabase as any)
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (profileData && !ignore) {
                setProfile(profileData);
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
            } finally {
              if (!ignore) {
                setLoading(false);
              }
            }
          }, 100);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Get initial session only once
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (ignore) return;
      
      console.log('Initial session check:', !!session);
      setSession(session);
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || ''
        });
      } else {
        setLoading(false);
      }
    }).catch(error => {
      console.error('Error getting initial session:', error);
      if (!ignore) {
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth listener...');
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('userPreferences');
    if (stored) {
      try {
        const parsedPrefs = JSON.parse(stored);
        setPreferences(parsedPrefs);
      } catch (error) {
        console.error('Error parsing stored preferences:', error);
      }
    }
  }, []);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const favoriteTools = preferences.favorites;

  const addFavorite = async (toolId: string) => {
    if (!user?.id || favoriteTools.includes(toolId)) return;
    
    const newFavorites = [...favoriteTools, toolId];
    setPreferences(prev => ({ ...prev, favorites: newFavorites }));
    
    try {
      await (supabase as any)
        .from('favorites')
        .insert({ user_id: user.id, item_id: toolId });
    } catch (error) {
      console.error('Error adding favorite:', error);
      // Revert on error
      setPreferences(prev => ({ ...prev, favorites: favoriteTools.filter(id => id !== toolId) }));
    }
  };

  const removeFavorite = async (toolId: string) => {
    if (!user?.id || !favoriteTools.includes(toolId)) return;
    
    const newFavorites = favoriteTools.filter(id => id !== toolId);
    setPreferences(prev => ({ ...prev, favorites: newFavorites }));
    
    try {
      await (supabase as any)
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', toolId);
    } catch (error) {
      console.error('Error removing favorite:', error);
      // Revert on error
      setPreferences(prev => ({ ...prev, favorites: [...favoriteTools, toolId] }));
    }
  };

  const toggleFavorite = (toolId: string) => {
    if (favoriteTools.includes(toolId)) {
      removeFavorite(toolId);
    } else {
      addFavorite(toolId);
    }
  };

  // Load favorites from database when user logs in
  useEffect(() => {
    if (!user?.id) return;
    
    const loadFavorites = async () => {
      try {
        const { data } = await (supabase as any)
          .from('favorites')
          .select('item_id')
          .eq('user_id', user.id);
          
        if (data) {
          const favoriteIds = data.map((fav: any) => fav.item_id);
          setPreferences(prev => ({ ...prev, favorites: favoriteIds }));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    
    loadFavorites();
  }, [user?.id]);

  const addToRecentlyViewed = (toolId: string) => {
    setPreferences(prev => {
      const filtered = prev.recentlyViewed.filter(id => id !== toolId);
      const newRecentlyViewed = [toolId, ...filtered].slice(0, 10); // Keep last 10
      return {
        ...prev,
        recentlyViewed: newRecentlyViewed
      };
    });
  };

  const setPreferredFreeOffering = (offerings: string[]) => {
    setPreferences(prev => ({
      ...prev,
      preferredFreeOffering: offerings
    }));
  };

  const setSortPreference = (sort: UserPreferences['sortPreference']) => {
    setPreferences(prev => ({
      ...prev,
      sortPreference: sort
    }));
  };

  const isFavorite = (toolId: string) => favoriteTools.includes(toolId);

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      user,
      profile,
      session,
      loading,
      favoriteTools,
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