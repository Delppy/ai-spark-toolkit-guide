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
    if (!shouldShowAd) return;

    console.log('[NewAd] Loading ad script...');

    // Create a unique container for this ad instance
    const adContainerId = `new-ad-container-${Date.now()}`;
    const adContainer = document.getElementById(adContainerId);
    
    if (!adContainer) {
      console.log('[NewAd] Container not found yet, will wait...');
      return;
    }

    // Clear any existing content
    adContainer.innerHTML = '';

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
    
    script.onload = () => {
      console.log('[NewAd] Script loaded successfully');
    };
    
    script.onerror = () => {
      console.error('[NewAd] Failed to load ad script');
    };

    // Append script to document head instead of container
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        document.head.removeChild(script);
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
        id={`new-ad-container-${Date.now()}`}
        className="w-[300px] h-[250px] bg-muted/10 border border-border/50 rounded-lg flex items-center justify-center overflow-hidden"
      >
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-muted-foreground text-xs">Loading Ad...</span>
        </div>
      </div>
    </div>
  );
};