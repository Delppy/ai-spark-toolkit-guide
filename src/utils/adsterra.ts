// Adsterra configuration and utilities
export const ADSTERRA_CONFIG = {
  // Your actual Adsterra ad codes
  bannerAdCode: {
    type: 'script',
    src: "//pl27377385.profitableratecpm.com/e8/0b/16/e80b168df17cd828ac576b784018b24a.js"
  },
  inContentAdCode: {
    type: 'script_container',
    src: "//pl27377371.profitableratecpm.com/30356e73d7c18e17a8ee9629abb2ee8c/invoke.js",
    containerId: "container-30356e73d7c18e17a8ee9629abb2ee8c"
  },
  sidebarAdCode: "your_sidebar_ad_code_here", // Add when you create more zones
};

// Initialize Adsterra ad with different formats
export const initializeAdsterraAd = (element: HTMLElement, adConfig: any) => {
  try {
    console.log('[initializeAdsterraAd] Starting with config:', adConfig);
    
    if (typeof window !== 'undefined' && element && adConfig) {
      // Clear any existing content
      element.innerHTML = '';
      
      if (adConfig.type === 'script') {
        console.log('[initializeAdsterraAd] Creating script type ad');
        // Simple script format
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = adConfig.src.startsWith('//') ? `https:${adConfig.src}` : adConfig.src;
        script.async = true;
        script.onload = () => console.log('[initializeAdsterraAd] Script loaded successfully');
        script.onerror = (e) => console.warn('[initializeAdsterraAd] Adsterra ad script failed to load:', e);
        element.appendChild(script);
        
        // Add a visual indicator that the ad space is ready
        const adIndicator = document.createElement('div');
        adIndicator.style.cssText = 'min-height: 90px; background: #f5f5f5; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; color: #666;';
        adIndicator.textContent = 'Ad Loading...';
        element.appendChild(adIndicator);
        
        // Remove indicator after script hopefully loads
        setTimeout(() => {
          if (adIndicator.parentNode) {
            adIndicator.remove();
          }
        }, 3000);
        
      } else if (adConfig.type === 'script_container') {
        console.log('[initializeAdsterraAd] Creating script_container type ad');
        // Script + container format
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = adConfig.src.startsWith('//') ? `https:${adConfig.src}` : adConfig.src;
        script.onload = () => console.log('[initializeAdsterraAd] Container script loaded successfully');
        script.onerror = (e) => console.warn('[initializeAdsterraAd] Container script failed to load:', e);
        
        const container = document.createElement('div');
        container.id = adConfig.containerId;
        container.style.cssText = 'min-height: 250px; background: #f5f5f5; border: 1px dashed #ccc;';
        
        element.appendChild(script);
        element.appendChild(container);
      }
    } else {
      console.warn('[initializeAdsterraAd] Missing required parameters:', { window: typeof window, element, adConfig });
    }
  } catch (error) {
    console.error('Adsterra initialization error:', error);
  }
};

// Get ad configuration based on type
export const getAdsterraAdScript = (type: 'banner' | 'incontent' | 'sidebar'): any => {
  const adConfigs = {
    banner: ADSTERRA_CONFIG.bannerAdCode,
    incontent: ADSTERRA_CONFIG.inContentAdCode, 
    sidebar: ADSTERRA_CONFIG.sidebarAdCode
  };
  
  const config = adConfigs[type] || null;
  console.log(`[getAdsterraAdScript] type: ${type}, config:`, config);
  return config;
};