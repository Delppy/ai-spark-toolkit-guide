
import { useMemo } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export const useAdPlacement = () => {
  const { user } = useUserPreferences();
  const { isPro } = useSubscription(user?.id);

  const adConfig = useMemo(() => ({
    showAds: !isPro,
    // Show ads every 6 cards for in-content placement
    inContentFrequency: 6,
    // Show banner ads at bottom
    showBottomBanner: !isPro,
    // Show sidebar ads on desktop (optional)
    showSidebar: !isPro,
  }), [isPro]);

  const shouldShowInContentAd = (index: number): boolean => {
    if (!adConfig.showAds) return false;
    // Show ad after every 6th item, but not on the first item
    return index > 0 && (index + 1) % adConfig.inContentFrequency === 0;
  };

  return {
    ...adConfig,
    shouldShowInContentAd,
  };
};
