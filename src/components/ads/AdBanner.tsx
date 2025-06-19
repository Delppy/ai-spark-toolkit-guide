
import React, { useEffect, useRef } from 'react';
import { GOOGLE_ADSENSE_CLIENT, AD_SLOTS, initializeAd, loadGoogleAdsense } from '@/utils/googleAds';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface AdBannerProps {
  slot?: keyof typeof AD_SLOTS;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slot = 'banner',
  format = 'auto',
  responsive = true,
  className = ''
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const { user } = useUserPreferences();
  const { isPro } = useSubscription(user?.id);
  const [adLoaded, setAdLoaded] = React.useState(false);

  useEffect(() => {
    // Don't show ads to Pro users
    if (isPro) return;

    // Load AdSense script
    loadGoogleAdsense();

    // Initialize ad after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (adRef.current && !adLoaded) {
        initializeAd(adRef.current);
        setAdLoaded(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isPro, adLoaded]);

  // Don't render ads for Pro users
  if (isPro) return null;

  return (
    <div className={`ad-container ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-1">Advertisement</div>
      <div
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client={GOOGLE_ADSENSE_CLIENT}
        data-ad-slot={AD_SLOTS[slot]}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};
