import { useEffect, useState } from "react";
import { useFreeAccess } from "@/hooks/useFreeAccess";
import { X } from "lucide-react";

export function FixedBottomAd() {
  const { isPro, loading } = useFreeAccess();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (loading) return;
    
    if (!isPro && isVisible) {
      // Load the ad script dynamically
      const script = document.createElement('script');
      script.async = true;
      script.src = '//pl27377371.revenuecpmgate.com/30356e73d7c18e17a8ee9629abb2ee8c/invoke.js';
      script.setAttribute('data-cfasync', 'false');
      
      const adContainer = document.getElementById('fixed-bottom-ad-container');
      if (adContainer && !adContainer.querySelector('script')) {
        adContainer.appendChild(script);
      }
    }
  }, [isPro, loading, isVisible]);

  if (loading || isPro || !isVisible) return null;

  return (
    <div 
      id="fixed-bottom-ad-container"
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg"
    >
      <div className="relative max-w-7xl mx-auto p-2 flex justify-center items-center min-h-[120px]">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors"
          aria-label="Close ad"
        >
          <X size={16} />
        </button>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Advertisement</p>
          <div id="container-30356e73d7c18e17a8ee9629abb2ee8c"></div>
        </div>
      </div>
    </div>
  );
}