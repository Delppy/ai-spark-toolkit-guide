import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type SubscriberRow = Tables<"subscribers"> | null;

interface SubscriptionStatus {
  isPro: boolean;
  premiumBadge: boolean;
  subscriptionStatus: string;
  subscriptionTier: string;
  subscriptionEndsAt: string | null;
  isActive: boolean;
  canUpgrade: boolean;
  showRemoveAds: boolean;
  loading: boolean;
  error: string | null;
  subscriber: SubscriberRow;
  refresh: () => Promise<void>;
  checkStatus: () => Promise<any>;
}

const fetchSubscription = async (userIdOrEmail?: string): Promise<SubscriberRow> => {
  if (!userIdOrEmail) return null;

  let query = supabase.from("subscribers").select("*");

  if (userIdOrEmail?.includes("@")) {
    query = query.eq("email", userIdOrEmail);
  } else if (userIdOrEmail) {
    query = query.eq("user_id", userIdOrEmail);
  }

  const { data, error: fetchError } = await query.maybeSingle();

  if (fetchError) {
    console.error("Could not fetch subscription data", fetchError);
    throw new Error("Could not fetch subscription data");
  }

  return data;
};

const checkSubscriptionStatus = async (): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('subscription-status');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Failed to check subscription status:", error);
    throw error;
  }
};


export const useSubscription = (userIdOrEmail?: string): SubscriptionStatus => {
  const queryClient = useQueryClient();
  
  // Fetch both local and server data
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['subscription', userIdOrEmail],
    queryFn: async () => {
      if (!userIdOrEmail) return null;
      
      // First try to get server status from /me endpoint
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session) {
          const { data: meData, error } = await supabase.functions.invoke('me', {
            headers: {
              Authorization: `Bearer ${session.session.access_token}`,
            },
          });
          
          if (!error && meData) {
            // Fetch full subscription data from database if we have the email
            let fullSubscription = null;
            if (meData.email) {
              try {
                fullSubscription = await fetchSubscription(meData.email);
              } catch (e) {
                console.error('Error fetching full subscription:', e);
              }
            }
            
            // Use server data as primary source
            return {
              subscription: fullSubscription || {
                premium_badge: meData.is_premium,
                pro_enabled: meData.is_premium,
                subscription_status: meData.subscription_status,
                subscription_tier: meData.subscription_tier,
                expires_at: meData.expires_at,
                subscription_ends_at: meData.expires_at,
                plan: meData.plan,
                // Add partial fields to satisfy type
              } as any,
              serverStatus: meData,
            };
          }
        }
      } catch (error) {
        console.error('Error fetching from /me endpoint:', error);
      }
      
      // Fallback to direct database query
      const subscription = await fetchSubscription(userIdOrEmail);
      const serverStatus = await checkSubscriptionStatus();
      return { subscription, serverStatus };
    },
    enabled: !!userIdOrEmail,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Extract data from the query result
  const subscriber = data?.subscription || null;
  const serverStatus = data?.serverStatus || null;
  
  // Use server status if available, fall back to local data
  const subscriptionStatus = serverStatus?.subscription_status || subscriber?.subscription_status || 'none';
  const subscriptionTier = serverStatus?.subscription_tier || subscriber?.subscription_tier || 'none';
  const premiumBadge = serverStatus?.is_premium ?? subscriber?.premium_badge ?? false;
  const subscriptionEndsAt = serverStatus?.expires_at || subscriber?.subscription_ends_at;
  const isActive = premiumBadge || subscriptionStatus === 'active' || subscriptionStatus === 'lifetime';

  // Determine UI state based on server-driven status
  const isPro = premiumBadge && (subscriptionStatus === 'active' || subscriptionStatus === 'lifetime');
  const canUpgrade = !isPro && subscriptionStatus !== 'active' && subscriptionStatus !== 'lifetime';
  const showRemoveAds = !(subscriptionStatus === 'active' || subscriptionStatus === 'lifetime'); // Hide CTA when active or lifetime regardless of badge

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['subscription', userIdOrEmail] });
  };

  const checkStatus = async () => {
    try {
      // Call the /me endpoint directly for immediate status check
      const { data: session } = await supabase.auth.getSession();
      if (session?.session) {
        const { data: meData, error } = await supabase.functions.invoke('me', {
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        });
        
        if (!error && meData) {
          console.log("[useSubscription] Status check result:", meData);
          await queryClient.invalidateQueries({ queryKey: ['subscription', userIdOrEmail] });
          return meData;
        }
      }
      
      // Fallback to subscription-status endpoint
      const status = await checkSubscriptionStatus();
      console.log("[useSubscription] Status check result:", status);
      return status;
    } catch (error) {
      console.error("[useSubscription] Status check failed:", error);
      throw error;
    }
  };

  React.useEffect(() => {
    // Sync subscription status on app launch and route changes
    if (userIdOrEmail) {
      // Force refresh on mount to ensure fresh data
      refresh();
    }
  }, [userIdOrEmail, refresh]);

  React.useEffect(() => {
    console.log("[useSubscription] State:", {
      userIdOrEmail,
      isPro,
      premiumBadge,
      subscriptionStatus,
      subscriptionTier,
      showRemoveAds,
      canUpgrade,
      isActive
    });
  }, [userIdOrEmail, isPro, premiumBadge, subscriptionStatus, subscriptionTier, showRemoveAds, canUpgrade, isActive]);

  return {
    isPro,
    premiumBadge,
    subscriptionStatus,
    subscriptionTier,
    subscriptionEndsAt,
    isActive,
    canUpgrade,
    showRemoveAds,
    loading,
    error: error ? error.message : null,
    subscriber: subscriber ?? null,
    refresh,
    checkStatus,
  };
};
