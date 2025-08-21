import React from 'react';
import { Button } from '@/components/ui/button';
import { PaymentGuard } from '@/components/billing/PaymentGuard';
import { useNavigate } from 'react-router-dom';

export const RemoveAdsButton: React.FC = () => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  return (
    <PaymentGuard onPaymentAttempt={handleUpgrade}>
      <Button 
        variant="default" 
        size="sm"
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
      >
        Remove Ads - Go Premium
      </Button>
    </PaymentGuard>
  );
};