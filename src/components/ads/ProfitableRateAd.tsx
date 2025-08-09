import React, { useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface ProfitableRateAdProps {
  className?: string;
}

export const ProfitableRateAd: React.FC<ProfitableRateAdProps> = ({ className = "" }) => {
  const { user } = useUserPreferences();
  const { isPro } = useSubscription(user?.id);
  
  // Show ads for non-logged-in users or logged-in users who are not Pro
  const shouldShowAd = !user || !isPro;

  useEffect(() => {
    if (!shouldShowAd) return;

    console.log('[ProfitableRateAd] Loading ad script...');

    // Create and append the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl27380163.profitableratecpm.com/9a/1f/07/9a1f075f29aa9045e554dfe6b3aa4154.js';
    script.async = true;
    
    script.onload = () => {
      console.log('[ProfitableRateAd] Script loaded successfully');
    };
    
    script.onerror = () => {
      console.error('[ProfitableRateAd] Failed to load ad script');
    };

    // Append script to document head
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
      <div className="w-full max-w-md h-auto bg-muted/10 border border-border/50 rounded-lg flex items-center justify-center overflow-hidden min-h-[100px]">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="text-muted-foreground text-xs">Loading Ad...</span>
        </div>
      </div>
    </div>
  );
};