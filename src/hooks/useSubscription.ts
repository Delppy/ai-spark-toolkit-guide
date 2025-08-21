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
  const { data: subscriber, isLoading: loading, error } = useQuery({
    queryKey: ['subscription', userIdOrEmail],
    queryFn: () => fetchSubscription(userIdOrEmail),
    enabled: !!userIdOrEmail,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
  });

  // Server-driven status check
  const { data: serverStatus } = useQuery({
    queryKey: ['subscription-status', userIdOrEmail],
    queryFn: checkSubscriptionStatus,
    enabled: !!userIdOrEmail,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Use server status if available, fall back to local data
  const subscriptionStatus = serverStatus?.subscription_status || subscriber?.subscription_status || 'none';
  const subscriptionTier = serverStatus?.subscription_tier || subscriber?.subscription_tier || 'none';
  const premiumBadge = serverStatus?.premium_badge ?? subscriber?.premium_badge ?? false;
  const subscriptionEndsAt = serverStatus?.subscription_ends_at || subscriber?.subscription_ends_at;
  const isActive = serverStatus?.is_active ?? false;

  // Determine UI state based on server-driven status
  const isPro = premiumBadge && (subscriptionStatus === 'active' || subscriptionStatus === 'lifetime');
  const canUpgrade = !isPro && subscriptionStatus !== 'active' && subscriptionStatus !== 'lifetime';
  const showRemoveAds = !(subscriptionStatus === 'active' || subscriptionStatus === 'lifetime'); // Hide CTA when active or lifetime regardless of badge

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['subscription', userIdOrEmail] });
    await queryClient.invalidateQueries({ queryKey: ['subscription-status', userIdOrEmail] });
  };

  const checkStatus = async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['subscription-status', userIdOrEmail] });
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
