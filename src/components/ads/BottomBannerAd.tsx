
import React from 'react';
import { AdsterraAd } from './AdsterraAd';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export const BottomBannerAd: React.FC = () => {
  const { user } = useUserPreferences();
  const { isPro } = useSubscription(user?.id);

  // Don't render for Pro users
  if (isPro) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg">
      <div className="container mx-auto px-4 py-2">
        <AdsterraAd 
          type="banner"
          className="max-w-full"
        />
      </div>
    </div>
  );
};
