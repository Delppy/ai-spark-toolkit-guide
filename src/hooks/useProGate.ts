
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
  const { isPro } = useSubscription(userId ?? undefined);
  const navigate = useNavigate();
  const location = useLocation();

  const proGate = (event?: React.MouseEvent, cb?: () => void) => {
    if (!isPro) {
      if (event) event.stopPropagation();
      // Store the page for redirect-after-payment (for the demo, use location.pathname)
      localStorage.setItem("afterProRedirect", location.pathname + location.search);
      navigate("/pricing");
      // Optionally: toast or visual "Please upgrade for Pro"
      return;
    } else {
      // If Pro, allow the callback (action)
      if (cb) cb();
    }
  };

  return { isPro, proGate };
}
