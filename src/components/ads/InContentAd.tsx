
import React from 'react';
import { AdsterraAd } from './AdsterraAd';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface InContentAdProps {
  className?: string;
}

export const InContentAd: React.FC<InContentAdProps> = ({ className = '' }) => {
  const { user } = useUserPreferences();
  const { isPro } = useSubscription(user?.id);

  // Don't render for Pro users
  if (isPro) return null;

  return (
    <div className={`my-8 ${className}`}>
      <AdsterraAd 
        type="incontent"
        className="max-w-md mx-auto"
      />
    </div>
  );
};
