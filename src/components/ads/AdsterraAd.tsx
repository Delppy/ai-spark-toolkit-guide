import React, { useEffect, useRef } from 'react';
import { getAdsterraAdScript, initializeAdsterraAd } from '@/utils/adsterra';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface AdsterraAdProps {
  type: 'banner' | 'incontent' | 'sidebar';
  className?: string;
}

export const AdsterraAd: React.FC<AdsterraAdProps> = ({
  type,
  className = ''
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const { user } = useUserPreferences();
  const { isPro } = useSubscription(user?.id);
  const [adLoaded, setAdLoaded] = React.useState(false);

  useEffect(() => {
    // Don't show ads to Pro users
    if (isPro) return;

    // Initialize ad after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (adRef.current && !adLoaded) {
        const adConfig = getAdsterraAdScript(type);
        if (adConfig && typeof adConfig === 'object' && adConfig.type) {
          initializeAdsterraAd(adRef.current, adConfig);
          setAdLoaded(true);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPro, adLoaded, type]);

  // Don't render ads for Pro users
  if (isPro) return null;

  // Don't render if no ad config available
  const adConfig = getAdsterraAdScript(type);
  if (!adConfig || typeof adConfig !== 'object' || !adConfig.type) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`}>
      <div className="text-xs text-muted-foreground text-center mb-1">Advertisement</div>
      <div
        ref={adRef}
        className="adsterra-ad"
        style={{ 
          display: 'block', 
          textAlign: 'center',
          minHeight: type === 'banner' ? '90px' : type === 'incontent' ? '250px' : '600px'
        }}
      />
    </div>
  );
};