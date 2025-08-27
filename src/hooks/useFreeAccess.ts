// Stub hook for free access - everything is free and available
export function useFreeAccess(_userId?: string | null) {
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

export function useProGate() {
  const proGate = (event?: React.MouseEvent, cb?: () => void) => {
    if (event) event.stopPropagation();
    if (cb) cb();
  };
  
  return { isPro: true, proGate };
}

export const useSubscription = useFreeAccess;
export const usePromptCredits = useFreeAccess;