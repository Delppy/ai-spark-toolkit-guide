import React, { createContext, useContext, useState, useEffect } from 'react';
import { AITool, PromptPack } from '@/data/aiTools';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from "@/integrations/supabase/types";
import type { Session, User } from "@supabase/supabase-js";
import { IS_PREMIUM_FREE } from '@/config/flags';

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

interface SubscriptionStatus {
  isPro: boolean;
  hasCredits: boolean;
  credits: number;
  loading: boolean;
  subscriptionStatus: 'free' | 'pro' | 'loading';
  premiumBadge: boolean;
  subscriptionEndsAt: null;
  subscriptionTier: 'free' | 'pro';
  showRemoveAds: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  user: UserContextType | null;
  profile: ProfileRow | null;
  session: Session | null;
  loading: boolean;
  favoriteTools: string[];
  subscription: SubscriptionStatus;
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
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  // Create subscription status object
  const subscription: SubscriptionStatus = React.useMemo(() => {
    if (IS_PREMIUM_FREE) {
      return {
        isPro: true,
        hasCredits: true,
        credits: Infinity,
        loading: false,
        subscriptionStatus: 'free',
        premiumBadge: false,
        subscriptionEndsAt: null,
        subscriptionTier: 'free',
        showRemoveAds: false,
      };
    }

    const isPro = !!subscriptionData;
    return {
      isPro,
      hasCredits: isPro,
      credits: isPro ? Infinity : 0,
      loading: loading || subscriptionLoading,
      subscriptionStatus: isPro ? 'pro' as const : 'free' as const,
      premiumBadge: isPro,
      subscriptionEndsAt: null,
      subscriptionTier: isPro ? 'pro' as const : 'free' as const,
      showRemoveAds: !isPro,
    };
  }, [subscriptionData, loading, subscriptionLoading]);

  // Check subscription status
  const checkSubscriptionStatus = React.useCallback(async () => {
    if (!user?.id || IS_PREMIUM_FREE) return;

    setSubscriptionLoading(true);
    try {
      const { data: subscriptionResult } = await (supabase as any)
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      setSubscriptionData(subscriptionResult);
    } catch (error) {
      console.error("Error checking subscription status:", error);
      setSubscriptionData(null);
    } finally {
      setSubscriptionLoading(false);
    }
  }, [user?.id]);

  // Check subscription when user changes
  useEffect(() => {
    if (user?.id && !loading) {
      checkSubscriptionStatus();
    } else if (!user) {
      setSubscriptionData(null);
    }
  }, [user?.id, loading, checkSubscriptionStatus]);

  // Single auth state listener to prevent multiple session checks
  useEffect(() => {
    let ignore = false;
    let profileFetchTimeout: NodeJS.Timeout;
    
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (ignore) return;
        
        // Completely ignore token refresh events
        if (event === 'TOKEN_REFRESHED') {
          return;
        }
        
        // Handle SIGNED_OUT more gracefully - might be rate limiting, not actual signout
        if (event === 'SIGNED_OUT') {
          console.log('Auth state changed: SIGNED_OUT - checking if this is rate limiting...');
          
          // Don't immediately clear session if it might be rate limiting
          // Give a short delay and check if we still have a valid session in storage
          setTimeout(() => {
            if (ignore) return;
            
            const storedSession = localStorage.getItem('aitouse-auth-token');
            if (storedSession) {
              try {
                const parsedSession = JSON.parse(storedSession);
                // If we have a stored session that's not expired, don't sign out
                if (parsedSession && parsedSession.expires_at && new Date(parsedSession.expires_at * 1000) > new Date()) {
                  console.log('Ignoring SIGNED_OUT - valid session still exists');
                  return;
                }
              } catch (e) {
                console.error('Error parsing stored session:', e);
              }
            }
            
            // Only clear state if we're sure it's a real signout
            console.log('Confirmed real signout - clearing auth state');
            setUser(null);
            setProfile(null);
            setSession(null);
            setLoading(false);
          }, 1000);
          return;
        }
        
        console.log('Auth state changed:', event, !!session);
        
        setSession(session);
        setLoading(true);
        
        // Clear any pending profile fetch
        if (profileFetchTimeout) {
          clearTimeout(profileFetchTimeout);
        }
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || ''
          });
          
          // Fetch profile with debounce to prevent multiple calls
          profileFetchTimeout = setTimeout(async () => {
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
          }, 300);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session to restore on page refresh
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && !ignore) {
          console.log('Restored existing session on mount');
          setSession(session);
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || ''
          });
          
          // Fetch profile for restored session
          const { data: profileData } = await (supabase as any)
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    
    checkExistingSession();

    return () => {
      console.log('Cleaning up auth listener...');
      ignore = true;
      if (profileFetchTimeout) {
        clearTimeout(profileFetchTimeout);
      }
      subscription.unsubscribe();
    };
  }, []); // Remove session dependency to prevent loops

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
      subscription,
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