
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PaymentGuard } from '@/components/billing/PaymentGuard';
import { useNavigate } from 'react-router-dom';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useSubscription } from '@/hooks/useSubscription';

export const RemoveAdsButton: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserPreferences();
  const { showRemoveAds, loading, isPro } = useSubscription(user?.id);

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  // Show Premium badge when subscription is active
  if (user && (isPro || !showRemoveAds)) {
    return <Badge variant="secondary">Premium Active</Badge>;
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
