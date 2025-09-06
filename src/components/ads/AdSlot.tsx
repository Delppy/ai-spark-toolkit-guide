import { useEffect, useState } from "react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { supabase } from "@/integrations/supabase/client";

interface AdSlotProps {
  type: 'banner' | 'interstitial' | 'popunder' | 'native' | 'rewarded';
  className?: string;
  scriptSrc?: string;
  containerId?: string;
}

/**
 * Universal AdSlot component that respects PRO user status
 * Returns null for PRO users, renders ads for free users
 */
export function AdSlot({ type, className = "", scriptSrc, containerId }: AdSlotProps) {
  const { subscription } = useUserPreferences();
  const [isPro, setIsPro] = useState<boolean>(subscription?.isPro || false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Double-check PRO status from backend
    const checkProStatus = async () => {
      try {
        const { data, error } = await supabase.rpc('rpc_is_user_pro');
        if (!error && data !== null) {
          setIsPro(data);
        } else {
          // Fallback to subscription check
          setIsPro(subscription?.isPro || false);
        }
      } catch (err) {
        console.error('[AdSlot] Error checking PRO status:', err);
        setIsPro(subscription?.isPro || false);
      } finally {
        setLoading(false);
      }
    };

    checkProStatus();
  }, [subscription?.isPro]);

  // Never show ads for PRO users
  if (loading || isPro) {
    return null;
  }

  // For free users, render ad container (actual ad loading handled by AdManager)
  if (containerId) {
    return (
      <div className={className}>
        <div id={containerId}></div>
      </div>
    );
  }

  // For scripts without containers
  return null;
}