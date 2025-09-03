import { useEffect, useRef } from "react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { SHOW_ADS } from "@/config/flags";

export function PopunderAd() {
  const { subscription } = useUserPreferences();
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const isPro = subscription?.isPro || false;

  useEffect(() => {
    // Remove any existing popunder scripts for pro users
    if (isPro) {
      // Remove the script if it exists
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      
      // Also remove any existing scripts with this src
      const existingScripts = document.querySelectorAll('script[src*="pl27377385.revenuecpmgate.com"]');
      existingScripts.forEach(script => script.remove());
      
      // Clear any popunder related global variables
      if (window) {
        Object.keys(window).forEach(key => {
          if (key.includes('popunder') || key.includes('PopAds')) {
            try {
              delete (window as any)[key];
            } catch (e) {
              // Some properties may not be deletable
            }
          }
        });
      }
      
      return;
    }
    
    // Only load for non-pro users
    if (!SHOW_ADS || subscription?.loading) return;
    
    // Load the popunder ad script for non-pro users
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl27377385.revenuecpmgate.com/e8/0b/16/e80b168df17cd828ac576b784018b24a.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    
    // Only add if not already present
    const existingScript = document.querySelector(`script[src="${script.src}"]`);
    if (!existingScript) {
      document.head.appendChild(script);
      scriptRef.current = script;
    }
    
    // Cleanup function
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [isPro, subscription?.loading]);

  // This component doesn't render anything visible
  return null;
}