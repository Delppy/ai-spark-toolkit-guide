
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * useProGate - Gating hook for Pro features.
 * @param userId - The logged-in user ID.
 * @returns {isPro, proGate}
 * - isPro: boolean if user is Pro.
 * - proGate: (cb) => Wrap an event/action so that if not pro, redirects to "/pricing"
 *             and stores current pathname (for post-payment redirect).
 */
export function useProGate(userId?: string | null) {
  // Premium layer disabled: treat everyone as Pro for gating
  const isPro = true;
  const navigate = useNavigate();
  const location = useLocation();

  const proGate = (event?: React.MouseEvent, cb?: () => void) => {
    // Always allow the action; show no paywall
    if (event) event.stopPropagation();
    if (cb) cb();
  };

  return { isPro, proGate };
}
