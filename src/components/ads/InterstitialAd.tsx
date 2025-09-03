import { useEffect } from "react";
import { useFreeAccess } from "@/hooks/useFreeAccess";
import { SHOW_ADS } from "@/config/flags";

export function InterstitialAd() {
  const { isPro, loading } = useFreeAccess();

  useEffect(() => {
    if (loading || !SHOW_ADS || isPro) return;
    
    // Load the interstitial ad script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl27380163.revenuecpmgate.com/9a/1f/07/9a1f075f29aa9045e554dfe6b3aa4154.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    
    // Only add if not already present
    const existingScript = document.querySelector(`script[src="${script.src}"]`);
    if (!existingScript) {
      document.head.appendChild(script);
    }
  }, [isPro, loading]);

  // This component doesn't render anything visible
  return null;
}