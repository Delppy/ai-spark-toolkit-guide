
export const GOOGLE_ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXX"; // You'll need to replace this with your actual AdSense client ID

export const AD_SLOTS = {
  banner: "1234567890", // Bottom banner ad slot
  inContent: "0987654321", // In-content ad slot between cards
  sidebar: "1122334455", // Optional sidebar ad slot
};

// Load Google AdSense script
export const loadGoogleAdsense = () => {
  if (typeof window !== 'undefined' && !document.querySelector('script[src*="adsbygoogle.js"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }
};

// Initialize ads after component mount
export const initializeAd = (element: HTMLElement) => {
  try {
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    }
  } catch (error) {
    console.error('AdSense initialization error:', error);
  }
};
