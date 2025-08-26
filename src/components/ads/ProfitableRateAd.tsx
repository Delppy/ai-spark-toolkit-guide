import React, { useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/useFreeAccess';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface ProfitableRateAdProps {
  className?: string;
}

export const ProfitableRateAd: React.FC<ProfitableRateAdProps> = ({ className = "" }) => {
  const { user } = useUserPreferences();
  const { isPro } = useSubscription(user?.id);
  const adRef = useRef<HTMLDivElement>(null);
  
  // Show ads for non-logged-in users or logged-in users who are not Pro
  const shouldShowAd = !user || !isPro;

  useEffect(() => {
    if (!shouldShowAd || !adRef.current) return;

    console.log('[ProfitableRateAd] Loading ad script...');

    // Clear any existing content
    adRef.current.innerHTML = '';

    // Create the ad script and inject directly into the ad container
    const adScript = `
      <script type="text/javascript" src="//pl27380163.profitableratecpm.com/9a/1f/07/9a1f075f29aa9045e554dfe6b3aa4154.js"></script>
    `;

    // Insert the ad HTML directly
    adRef.current.innerHTML = adScript;

    console.log('[ProfitableRateAd] Ad script injected');
  }, [shouldShowAd]);

  // Don't render anything if shouldn't show ad
  if (!shouldShowAd) {
    return null;
  }

  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <div 
        ref={adRef}
        className="w-full max-w-md min-h-[100px] bg-muted/10 border border-border/50 rounded-lg flex items-center justify-center overflow-hidden"
      >
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-muted-foreground text-xs">Loading Ad...</span>
        </div>
      </div>
    </div>
  );
};