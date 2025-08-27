import React, { useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/useFreeAccess';
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
  const { isPro } = useSubscription(user?.id || null);
  const adRef = useRef<HTMLDivElement>(null);
  
  // Show ads for non-logged-in users or logged-in users who are not Pro
  const shouldShowAd = !user || !isPro;

  useEffect(() => {
    if (!shouldShowAd || !adRef.current) return;

    console.log('[NewAd] Loading ad script...');

    // Clear any existing content
    adRef.current.innerHTML = '';

    // Set up the ad options BEFORE loading the script
    window.atOptions = {
      'key': '36e9f38cd9b4a6eb7839d66b237b5878',
      'format': 'iframe',
      'height': 250,
      'width': 300,
      'params': {}
    };

    // Create the ad script and inject directly into the ad container
    const adScript = `
      <script type="text/javascript">
        atOptions = {
          'key': '36e9f38cd9b4a6eb7839d66b237b5878',
          'format': 'iframe',
          'height': 250,
          'width': 300,
          'params': {}
        };
      </script>
      <script type="text/javascript" src="//www.highperformanceformat.com/36e9f38cd9b4a6eb7839d66b237b5878/invoke.js"></script>
    `;

    // Insert the ad HTML directly
    adRef.current.innerHTML = adScript;

    console.log('[NewAd] Ad script injected');
  }, [shouldShowAd]);

  // Don't render anything if shouldn't show ad
  if (!shouldShowAd) {
    return null;
  }

  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <div 
        ref={adRef}
        className="w-[300px] min-h-[250px] bg-muted/10 border border-border/50 rounded-lg flex items-center justify-center overflow-hidden"
      >
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-muted-foreground text-xs">Loading Ad...</span>
        </div>
      </div>
    </div>
  );
};