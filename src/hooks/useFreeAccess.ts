import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IS_PREMIUM_FREE } from '@/config/flags';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export function useFreeAccess(_userId?: string | null) {
  const [isPro, setIsPro] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<"free" | "pro" | "loading">("loading");
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
        setIsPro(false);
        setSubscriptionStatus("free");
        return { isPro: false, subscriptionStatus: "free" as const };
      }

      const { data: subscription } = await (supabase as any)
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      const isProStatus = !!subscription;
      setIsPro(isProStatus);
      setSubscriptionStatus(isProStatus ? "pro" : "free");
      
      return { isPro: isProStatus, subscriptionStatus: isProStatus ? "pro" as const : "free" as const };
    } catch (error) {
      console.error("Error checking subscription status:", error);
      setIsPro(false);
      setSubscriptionStatus("free");
      return { isPro: false, subscriptionStatus: "free" as const };
    }
  };

  useEffect(() => {
    if (!authLoading && user?.id) {
      checkStatus();
    } else if (!authLoading && !user) {
      setIsPro(false);
      setSubscriptionStatus("free");
    }
  }, [user?.id, authLoading]);

  return { 
    isPro, 
    hasCredits: isPro,
    credits: isPro ? Infinity : 0,
    useCredit: async () => isPro,
    loading: authLoading || subscriptionStatus === "loading",
    subscriptionStatus, 
    premiumBadge: isPro,
    subscriptionEndsAt: null,
    subscriptionTier: isPro ? 'pro' : 'free',
    refresh: checkStatus,
    checkStatus,
    showRemoveAds: !isPro,
  };
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