import React from 'react';
import { Button } from '@/components/ui/button';
import { PaymentGuard } from '@/components/billing/PaymentGuard';
import { useRouter } from 'react-router-dom';

export const RemoveAdsButton: React.FC = () => {
  const navigate = useRouter();

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <PaymentGuard onPaymentAttempt={handleUpgrade}>
      <Button 
        variant="premium" 
        size="sm"
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
      >
        Remove Ads - Go Premium
      </Button>
    </PaymentGuard>
  );
};