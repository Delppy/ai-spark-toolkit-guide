import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export const PremiumSyncGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user } = useUserPreferences();
  const { refresh } = useSubscription(user?.id);

  useEffect(() => {
    // Sync subscription status on key routes
    const syncRoutes = ['/dashboard', '/account', '/profile', '/pricing'];
    const shouldSync = syncRoutes.some(route => location.pathname.startsWith(route));
    
    // Also sync if coming back from payment
    const isReturnFromPayment = location.search.includes('upgraded=true') || 
                               location.search.includes('reference=');

    if ((shouldSync || isReturnFromPayment) && user?.id) {
      refresh();
    }
  }, [location.pathname, location.search, user?.id, refresh]);

  return <>{children}</>;
};