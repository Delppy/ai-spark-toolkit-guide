
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
  const { showRemoveAds, loading, isPro, premiumBadge, subscriptionStatus } = useSubscription(user?.id);

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  // Show Premium badge when subscription is active
  if (user && (isPro || premiumBadge || subscriptionStatus === 'active' || subscriptionStatus === 'lifetime' || !showRemoveAds)) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 text-primary border-primary/20">
          ✨ Premium Active
        </Badge>
        <span className="text-xs text-muted-foreground hidden sm:inline">Thanks for supporting AIToUse</span>
      </div>
    );
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
