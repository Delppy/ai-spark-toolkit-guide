
import { useState, useEffect } from "react";
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

export const useSubscription = (userIdOrEmail?: string) : SubscriptionStatus => {
  const [subscriber, setSubscriber] = useState<SubscriberRow>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription info when user id or email changes
  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);

    let query = supabase.from("subscribers").select("*").maybeSingle();

    if (userIdOrEmail?.includes("@")) {
      query = query.eq("email", userIdOrEmail);
    } else {
      query = query.eq("user_id", userIdOrEmail);
    }

    const { data, error } = await query;
    if (error) {
      setError("Could not fetch subscription data");
      setSubscriber(null);
    } else {
      setSubscriber(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userIdOrEmail) fetchSubscription();
    else {
      setSubscriber(null);
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [userIdOrEmail]);

  const plan = subscriber?.plan ?? null;
  const proEnabled = !!subscriber?.pro_enabled;
  const trialUsed = !!subscriber?.trial_used;
  const trialStart = subscriber?.trial_start ?? null;
  const trialExpiration = subscriber?.trial_expiration ?? null;

  // Active free trial: has a trial_start and NOT trial_used and current date is within the trial range
  let trialActive = false;
  if (trialStart && trialExpiration && !trialUsed) {
    const now = new Date();
    try {
      const start = new Date(trialStart);
      const end = new Date(trialExpiration);
      trialActive = now >= start && now <= end;
    } catch (e) { /* ignore invalid date */ }
  }

  // Pro is active if pro_enabled OR trialActive (for feature gating)
  const isPro = proEnabled || trialActive;

  return {
    isPro,
    plan,
    trialActive,
    trialUsed,
    trialStart,
    trialExpiration,
    loading,
    error,
    subscriber,
    refresh: fetchSubscription,
  };
};
