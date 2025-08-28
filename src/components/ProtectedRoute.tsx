import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { IS_PREMIUM_FREE } from '@/config/flags';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true }) => {
  const { user } = useUserPreferences();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    supabase.auth.getSession().then(() => {
      setLoading(false);
    });
  }, []);

  // If premium features are free, no authentication required
  if (IS_PREMIUM_FREE) {
    return <>{children}</>;
  }

  // Show loading spinner while checking auth status
  if (loading) {
    return <LoadingSpinner />;
  }

  // If authentication is required and user is not logged in, redirect to login
  if (requireAuth && !user) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated or auth not required, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;