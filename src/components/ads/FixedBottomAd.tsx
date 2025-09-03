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
      <div className="relative max-w-7xl mx-auto p-1 sm:p-2 flex justify-center items-center min-h-[60px] max-h-[120px] overflow-hidden">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 hover:bg-muted rounded-full transition-colors z-10 bg-background/80 backdrop-blur-sm"
          aria-label="Close ad"
        >
          <X size={14} className="sm:w-4 sm:h-4" />
        </button>
        <div className="text-center w-full px-6 sm:px-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-xs font-medium text-muted-foreground/80 bg-muted/50 px-2 py-1 rounded-full border border-border/50 backdrop-blur-sm">
              Advertisement
            </span>
            <div className="h-px bg-border flex-1"></div>
          </div>
          <div 
            id="container-30356e73d7c18e17a8ee9629abb2ee8c"
            className="max-w-[320px] sm:max-w-full mx-auto overflow-hidden"
            style={{ maxHeight: '80px' }}
          ></div>
        </div>
      </div>
    </div>
  );
}