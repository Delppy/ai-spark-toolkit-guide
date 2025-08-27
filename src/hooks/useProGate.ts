
// Re-export from useFreeAccess
export { useProGate } from "@/hooks/useFreeAccess";

// Also export a version that accepts optional parameters for compatibility
export function useProGateCompat(_userId?: string) {
  const proGate = (event?: React.MouseEvent, cb?: () => void) => {
    if (event) event.stopPropagation();
    if (cb) cb();
  };
  
  return { isPro: true, proGate };
}
