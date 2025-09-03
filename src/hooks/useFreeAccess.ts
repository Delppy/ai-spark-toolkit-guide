import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IS_PREMIUM_FREE, FREE_USER_CREDITS, MAX_FREE_CREDITS } from '@/config/flags';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export function useFreeAccess(_userId?: string | null) {
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const { user, loading: authLoading } = useUserPreferences();

  // If premium is free, return free mode
  if (IS_PREMIUM_FREE) {
    return {
      isPro: true,
      hasCredits: true,
      credits: Infinity,
      useCredit: async () => true,
      loading: false,
      subscriptionStatus: 'free',
      premiumBadge: false,
      subscriptionEndsAt: null,
      subscriptionTier: 'free',
      refresh: async () => {},
      checkStatus: async () => null,
      showRemoveAds: false,
    };
  }

  const checkStatus = async () => {
    try {
      if (!user?.id) {
        setSubscriptionData(null);
        return { isPro: false, subscriptionStatus: "free" as const };
      }

      setSubscriptionLoading(true);
      const { data: subscription } = await (supabase as any)
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      setSubscriptionData(subscription);
      const isProStatus = !!subscription;
      
      return { isPro: isProStatus, subscriptionStatus: isProStatus ? "pro" as const : "free" as const };
    } catch (error) {
      console.error("Error checking subscription status:", error);
      setSubscriptionData(null);
      return { isPro: false, subscriptionStatus: "free" as const };
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Only check subscription when user changes, not on every render
  useEffect(() => {
    if (!authLoading && user?.id) {
      checkStatus();
    } else if (!authLoading && !user) {
      setSubscriptionData(null);
    }
  }, [user?.id, authLoading]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => {
    const isPro = !!subscriptionData;
    
    return { 
      isPro, 
      hasCredits: isPro,
      credits: isPro ? Infinity : 0,
      useCredit: async () => isPro,
      loading: authLoading || subscriptionLoading,
      subscriptionStatus: isPro ? 'pro' as const : 'free' as const, 
      premiumBadge: isPro,
      subscriptionEndsAt: null,
      subscriptionTier: isPro ? 'pro' : 'free',
      refresh: checkStatus,
      checkStatus,
      showRemoveAds: !isPro,
    };
  }, [subscriptionData, authLoading, subscriptionLoading]);
}

export function useProGate() {
  const { isPro } = useFreeAccess();
  
  const proGate = (event?: React.MouseEvent, cb?: () => void) => {
    if (event) event.stopPropagation();
    if (isPro && cb) {
      cb();
    } else if (!isPro) {
      // Redirect to pricing page
      window.location.href = '/pricing';
    }
  };
  
  return { isPro, proGate };
}

export const useSubscription = useFreeAccess;
export const usePromptCredits = useFreeAccess;