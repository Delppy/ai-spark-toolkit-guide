import { useEffect, useRef } from "react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { supabase } from "@/integrations/supabase/client";

// Ad scripts configuration
const AD_SCRIPTS = {
  banner: {
    src: '//pl27377371.revenuecpmgate.com/30356e73d7c18e17a8ee9629abb2ee8c/invoke.js',
    containerId: 'container-30356e73d7c18e17a8ee9629abb2ee8c',
  },
  popunder: {
    src: '//pl27377385.revenuecpmgate.com/e8/0b/16/e80b168df17cd828ac576b784018b24a.js',
  },
  interstitial: {
    src: '//pl27380163.revenuecpmgate.com/9a/1f/07/9a1f075f29aa9045e554dfe6b3aa4154.js',
  },
};

// Global ad manager to prevent multiple initializations
let adManagerInstance: AdManager | null = null;

class AdManager {
  private isPro: boolean = false;
  private initialized: boolean = false;
  private blockedScripts: Set<string> = new Set();
  private cleanupFunctions: (() => void)[] = [];

  constructor() {
    // Singleton pattern
    if (adManagerInstance) {
      return adManagerInstance;
    }
    adManagerInstance = this;
  }

  async checkProStatus(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('rpc_is_user_pro');
      if (error) {
        console.error('Error checking PRO status:', error);
        // Fallback to subscription check
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .eq('status', 'active')
          .single();
        return !!sub;
      }
      return !!data;
    } catch (err) {
      console.error('Failed to check PRO status:', err);
      return false;
    }
  }

  async initialize(forcePro?: boolean) {
    if (this.initialized) return;
    
    // Check PRO status
    this.isPro = forcePro ?? await this.checkProStatus();
    
    if (this.isPro) {
      // Block all ads for PRO users
      this.blockAllAds();
      console.log('[AdManager] PRO user detected - all ads blocked');
    } else {
      console.log('[AdManager] Free user - ads enabled');
    }
    
    this.initialized = true;
  }

  blockAllAds() {
    // Remove all ad scripts
    this.removeAllAdScripts();
    
    // Block future script loading
    this.interceptScriptLoading();
    
    // Clean up ad containers
    this.cleanupAdContainers();
    
    // Clear ad-related global variables
    this.clearAdGlobals();
    
    // Prevent popups/popunders
    this.blockPopups();
  }

  private removeAllAdScripts() {
    // Remove all known ad scripts
    Object.values(AD_SCRIPTS).forEach(config => {
      const scripts = document.querySelectorAll(`script[src*="${config.src.replace('//', '')}"]`);
      scripts.forEach(script => {
        script.remove();
        this.blockedScripts.add(config.src);
      });
    });

    // Remove inline ad scripts
    const allScripts = document.querySelectorAll('script');
    allScripts.forEach(script => {
      if (script.innerHTML.includes('atOptions') || 
          script.innerHTML.includes('revenuecpmgate') ||
          script.innerHTML.includes('highperformanceformat')) {
        script.remove();
      }
    });
  }

  private interceptScriptLoading() {
    // Override appendChild to block ad scripts
    const originalAppendChild = Element.prototype.appendChild;
    const blockedScripts = this.blockedScripts;
    
    Element.prototype.appendChild = function(node: Node) {
      if (node instanceof HTMLScriptElement && node.src) {
        for (const blockedSrc of blockedScripts) {
          if (node.src.includes(blockedSrc.replace('//', ''))) {
            console.log('[AdManager] Blocked ad script:', node.src);
            return node;
          }
        }
      }
      return originalAppendChild.call(this, node);
    };

    this.cleanupFunctions.push(() => {
      Element.prototype.appendChild = originalAppendChild;
    });
  }

  private cleanupAdContainers() {
    // Remove all ad containers
    Object.values(AD_SCRIPTS).forEach(config => {
      if ('containerId' in config) {
        const container = document.getElementById(config.containerId);
        if (container) container.remove();
      }
    });

    // Remove any fixed ad containers
    document.querySelectorAll('[id*="container-"][id*="revenuecpmgate"]').forEach(el => el.remove());
    document.querySelectorAll('[id*="fixed-bottom-ad"]').forEach(el => el.remove());
  }

  private clearAdGlobals() {
    // Clear ad-related global variables
    if (typeof window !== 'undefined') {
      const adKeys = ['atOptions', 'PopAds', 'InterAds', 'popunder', 'interstitial'];
      adKeys.forEach(key => {
        try {
          delete (window as any)[key];
        } catch (e) {
          // Some properties may not be deletable
        }
      });

      // Clear any objects with ad-related properties
      Object.keys(window).forEach(key => {
        if (key.includes('popunder') || key.includes('PopAds') || 
            key.includes('interstitial') || key.includes('InterAds') ||
            key.includes('revenue') || key.includes('cpmgate')) {
          try {
            delete (window as any)[key];
          } catch (e) {
            // Ignore errors
          }
        }
      });
    }
  }

  private blockPopups() {
    // Override window.open to prevent popups
    const originalOpen = window.open;
    window.open = function(url?: string | URL, ...args: any[]) {
      if (url && typeof url === 'string' && 
          (url.includes('revenuecpmgate') || url.includes('highperformanceformat'))) {
        console.log('[AdManager] Blocked popup:', url);
        return null;
      }
      return originalOpen.call(window, url, ...args);
    };

    this.cleanupFunctions.push(() => {
      window.open = originalOpen;
    });

    // Prevent click hijacking
    document.addEventListener('click', this.handleClickHijack, true);
    this.cleanupFunctions.push(() => {
      document.removeEventListener('click', this.handleClickHijack, true);
    });
  }

  private handleClickHijack = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.closest('a')) {
      const link = target.closest('a') as HTMLAnchorElement;
      if (link.href && (link.href.includes('revenuecpmgate') || 
          link.href.includes('highperformanceformat'))) {
        e.preventDefault();
        e.stopPropagation();
        console.log('[AdManager] Blocked ad redirect');
      }
    }
  };

  cleanup() {
    this.cleanupFunctions.forEach(fn => fn());
    this.cleanupFunctions = [];
    this.initialized = false;
  }

  getStatus() {
    return {
      isPro: this.isPro,
      initialized: this.initialized,
      blockedScripts: Array.from(this.blockedScripts),
    };
  }
}

// Hook for using the ad manager
export function useAdManager() {
  const { subscription } = useUserPreferences();
  const managerRef = useRef<AdManager | null>(null);

  useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = new AdManager();
    }

    // Initialize with subscription status
    managerRef.current.initialize(subscription?.isPro);

    return () => {
      // Cleanup on unmount
      if (managerRef.current) {
        managerRef.current.cleanup();
      }
    };
  }, [subscription?.isPro]);

  return managerRef.current;
}

// Export singleton instance for global access
export const globalAdManager = new AdManager();