import { IS_PREMIUM_FREE } from '@/config/flags';

// Everything is free when IS_PREMIUM_FREE is true
export function useFreeAccess(_userId?: string | null) {
  return {
    isPro: true, // Always true in free mode
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
    showRemoveAds: false, // Never show ads or payment prompts in free mode
  };
}

export function useProGate() {
  // No gating in free mode - just execute the callback
  const proGate = (event?: React.MouseEvent, cb?: () => void) => {
    if (event) event.stopPropagation();
    if (cb) cb();
  };
  
  return { isPro: true, proGate };
}

export const useSubscription = useFreeAccess;
export const usePromptCredits = useFreeAccess;