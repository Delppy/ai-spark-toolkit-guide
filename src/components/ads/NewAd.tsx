import React, { useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface NewAdProps {
  className?: string;
}

declare global {
  interface Window {
    atOptions: any;
  }
}

export const NewAd: React.FC<NewAdProps> = ({ className = "" }) => {
  const { user } = useUserPreferences();
  const { isPro } = useSubscription(user?.id);
  
  // Show ads for non-logged-in users or logged-in users who are not Pro
  const shouldShowAd = !user || !isPro;

  useEffect(() => {
    if (!shouldShowAd) return; // Don't load ads for Pro users or if shouldShowAd is false

    // Set up the ad options
    window.atOptions = {
      'key': '36e9f38cd9b4a6eb7839d66b237b5878',
      'format': 'iframe',
      'height': 250,
      'width': 300,
      'params': {}
    };

    // Create and append the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//www.highperformanceformat.com/36e9f38cd9b4a6eb7839d66b237b5878/invoke.js';
    script.async = true;

    const adContainer = document.getElementById('new-ad-container');
    if (adContainer) {
      adContainer.appendChild(script);
    }

    return () => {
      // Cleanup script on unmount
      if (adContainer && script.parentNode) {
        adContainer.removeChild(script);
      }
    };
  }, [shouldShowAd]);

  // Don't render anything if shouldn't show ad
  if (!shouldShowAd) {
    return null;
  }

  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <div 
        id="new-ad-container" 
        className="w-[300px] h-[250px] bg-muted/20 border border-border rounded-lg flex items-center justify-center"
      >
        <span className="text-muted-foreground text-sm">Advertisement</span>
      </div>
    </div>
  );
};