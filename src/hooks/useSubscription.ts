import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type SubscriberRow = Tables<"subscribers"> | null;

interface SubscriptionStatus {
  isPro: boolean;
  plan: string | null;
  trialActive: boolean;
  trialUsed: boolean;
  trialStart: string | null;
  trialExpiration: string | null;
  loading: boolean;
  error: string | null;
  subscriber: SubscriberRow;
  refresh: () => Promise<void>;
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


export const useSubscription = (userIdOrEmail?: string): SubscriptionStatus => {
  const queryClient = useQueryClient();
  const { data: subscriber, isLoading: loading, error } = useQuery({
    queryKey: ['subscription', userIdOrEmail],
    queryFn: () => fetchSubscription(userIdOrEmail),
    enabled: !!userIdOrEmail,
  });

  const plan = subscriber?.plan ?? null;
  const proEnabled = !!subscriber?.pro_enabled;
  const trialUsed = !!subscriber?.trial_used;
  const trialStart = subscriber?.trial_start ?? null;
  const trialExpiration = subscriber?.trial_expiration ?? null;

  let trialActive = false;
  if (trialStart && trialExpiration && !trialUsed) {
    const now = new Date();
    try {
      const start = new Date(trialStart);
      const end = new Date(trialExpiration);
      trialActive = now >= start && now <= end;
    } catch (e) {
      /* ignore invalid date */
    }
  }

  const isPro = proEnabled || trialActive;

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['subscription', userIdOrEmail] });
  };

  React.useEffect(() => {
    console.log("[useSubscription] userIdOrEmail:", userIdOrEmail, "isPro:", isPro, "plan:", plan, "subscriber:", subscriber);
  }, [userIdOrEmail, isPro, plan, subscriber]);

  return {
    isPro,
    plan,
    trialActive,
    trialUsed,
    trialStart,
    trialExpiration,
    loading,
    error: error ? error.message : null,
    subscriber: subscriber ?? null,
    refresh,
  };
};
