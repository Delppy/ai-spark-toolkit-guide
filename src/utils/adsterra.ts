// Adsterra configuration and utilities
export const ADSTERRA_CONFIG = {
  // Replace these with your actual Adsterra ad codes
  bannerAdCode: "your_banner_ad_code_here", // Bottom banner
  inContentAdCode: "your_incontent_ad_code_here", // Between content cards
  sidebarAdCode: "your_sidebar_ad_code_here", // Sidebar (optional)
};

// Load Adsterra script
export const loadAdsterraScript = () => {
  if (typeof window !== 'undefined' && !document.querySelector('script[src*="adsterra"]')) {
    // Adsterra typically provides specific script URLs
    // You'll need to replace this with your actual Adsterra script URL
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://a.realsrv.com/ad-provider.js"; // Example URL - replace with actual
    document.head.appendChild(script);
  }
};

// Initialize Adsterra ad
export const initializeAdsterraAd = (element: HTMLElement, adCode: string) => {
  try {
    if (typeof window !== 'undefined' && element) {
      // Adsterra ads are typically initialized by setting innerHTML
      // with the ad code they provide
      element.innerHTML = adCode;
    }
  } catch (error) {
    console.error('Adsterra initialization error:', error);
  }
};

// Example ad codes structure (you'll replace these with your actual codes)
export const getAdsterraAdCode = (type: 'banner' | 'incontent' | 'sidebar') => {
  const adCodes = {
    banner: `
      <script type="text/javascript">
        atOptions = {
          'key' : '${ADSTERRA_CONFIG.bannerAdCode}',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="//a.realsrv.com/nativeads-v2.js"></script>
    `,
    incontent: `
      <script type="text/javascript">
        atOptions = {
          'key' : '${ADSTERRA_CONFIG.inContentAdCode}',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="//a.realsrv.com/nativeads-v2.js"></script>
    `,
    sidebar: `
      <script type="text/javascript">
        atOptions = {
          'key' : '${ADSTERRA_CONFIG.sidebarAdCode}',
          'format' : 'iframe',
          'height' : 600,
          'width' : 160,
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="//a.realsrv.com/nativeads-v2.js"></script>
    `
  };
  
  return adCodes[type] || '';
};