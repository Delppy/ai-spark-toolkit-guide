import { useEffect } from "react";
import { useFreeAccess } from "@/hooks/useFreeAccess";
import { SHOW_ADS } from "@/config/flags";

export function PopunderAd() {
  const { isPro, loading } = useFreeAccess();

  useEffect(() => {
    if (loading || !SHOW_ADS || isPro) return;
    
    // Load the popunder ad script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl27377385.revenuecpmgate.com/e8/0b/16/e80b168df17cd828ac576b784018b24a.js';
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