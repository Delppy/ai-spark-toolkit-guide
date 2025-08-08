// Adsterra configuration and utilities
export const ADSTERRA_CONFIG = {
  // Your actual Adsterra ad codes
  bannerAdCode: "//pl27377385.profitableratecpm.com/e8/0b/16/e80b168df17cd828ac576b784018b24a.js", // Your first ad code
  inContentAdCode: "your_incontent_ad_code_here", // Add when you create more zones
  sidebarAdCode: "your_sidebar_ad_code_here", // Add when you create more zones
};

// Load Adsterra script
export const loadAdsterraScript = () => {
  if (typeof window !== 'undefined') {
    // For script-based ads, we'll load them individually
    return true;
  }
  return false;
};

// Initialize Adsterra ad with script-based approach
export const initializeAdsterraAd = (element: HTMLElement, scriptSrc: string) => {
  try {
    if (typeof window !== 'undefined' && element && scriptSrc) {
      // Clear any existing content
      element.innerHTML = '';
      
      // Create script element
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptSrc.startsWith('//') ? `https:${scriptSrc}` : scriptSrc;
      script.async = true;
      
      // Add error handling
      script.onerror = () => {
        console.warn('Adsterra ad script failed to load');
      };
      
      // Append script to the ad container
      element.appendChild(script);
    }
  } catch (error) {
    console.error('Adsterra initialization error:', error);
  }
};

// Get ad script URL based on type
export const getAdsterraAdScript = (type: 'banner' | 'incontent' | 'sidebar'): string => {
  const adScripts = {
    banner: ADSTERRA_CONFIG.bannerAdCode,
    incontent: ADSTERRA_CONFIG.inContentAdCode, 
    sidebar: ADSTERRA_CONFIG.sidebarAdCode
  };
  
  return adScripts[type] || '';
};