import { useEffect } from "react";
import { useFreeAccess } from "./useFreeAccess";

export function useAdRemoval() {
  const { isPro, loading } = useFreeAccess();

  useEffect(() => {
    if (loading) return;

    if (isPro) {
      // Remove ad scripts when user is pro
      const adScripts = [
        '//pl27380163.revenuecpmgate.com/9a/1f/07/9a1f075f29aa9045e554dfe6b3aa4154.js',
        '//pl27377371.revenuecpmgate.com/30356e73d7c18e17a8ee9629abb2ee8c/invoke.js',
        '//pl27377385.revenuecpmgate.com/e8/0b/16/e80b168df17cd828ac576b784018b24a.js',
        '//www.highperformanceformat.com/36e9f38cd9b4a6eb7839d66b237b5878/invoke.js'
      ];

      // Remove scripts by src
      adScripts.forEach(src => {
        const scripts = document.querySelectorAll(`script[src*="${src.replace('//', '')}"]`);
        scripts.forEach(script => script.remove());
      });

      // Remove inline script with atOptions
      const allScripts = document.querySelectorAll('script');
      allScripts.forEach(script => {
        if (script.innerHTML.includes('atOptions') || script.innerHTML.includes('36e9f38cd9b4a6eb7839d66b237b5878')) {
          script.remove();
        }
      });

      // Remove ad container div
      const adContainer = document.getElementById('container-30356e73d7c18e17a8ee9629abb2ee8c');
      if (adContainer) {
        adContainer.remove();
      }
    }
  }, [isPro, loading]);

  return { isPro, loading };
}