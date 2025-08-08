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
    if (typeof window !== 'undefined' && element && adConfig) {
      // Clear any existing content
      element.innerHTML = '';
      
      if (adConfig.type === 'script') {
        // Simple script format
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = adConfig.src.startsWith('//') ? `https:${adConfig.src}` : adConfig.src;
        script.async = true;
        script.onerror = () => console.warn('Adsterra ad script failed to load');
        element.appendChild(script);
        
      } else if (adConfig.type === 'script_container') {
        // Script + container format
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = adConfig.src.startsWith('//') ? `https:${adConfig.src}` : adConfig.src;
        script.onerror = () => console.warn('Adsterra ad script failed to load');
        
        const container = document.createElement('div');
        container.id = adConfig.containerId;
        
        element.appendChild(script);
        element.appendChild(container);
      }
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
  
  return adConfigs[type] || null;
};