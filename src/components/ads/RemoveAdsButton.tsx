
import React from 'react';
import { Button } from '@/components/ui/button';
import { PaymentGuard } from '@/components/billing/PaymentGuard';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useSubscription } from '@/hooks/useSubscription';

export const RemoveAdsButton: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserPreferences();
  const { showRemoveAds, loading } = useSubscription(user?.id);

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  // Hide the CTA entirely when the server reports active or lifetime
  if (user && !showRemoveAds) {
    return null;
  }

  return (
    <PaymentGuard onPaymentAttempt={handleUpgrade}>
      <Button 
        variant="default" 
        size="sm"
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
        disabled={loading}
      >
        {loading ? 'Checking…' : 'Remove Ads - Go Premium'}
      </Button>
    </PaymentGuard>
  );
};
