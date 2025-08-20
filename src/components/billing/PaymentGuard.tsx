import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentGuardProps {
  children: React.ReactNode;
  onPaymentAttempt?: () => void;
}

export const PaymentGuard: React.FC<PaymentGuardProps> = ({ children, onPaymentAttempt }) => {
  const { user } = useUserPreferences();
  const { checkStatus, isPro, premiumBadge, subscriptionStatus } = useSubscription(user?.id);
  const [isChecking, setIsChecking] = React.useState(false);

  const handlePaymentAttempt = async () => {
    if (!user) {
      toast.error('Please log in to upgrade to Premium');
      return;
    }

    setIsChecking(true);
    try {
      // Pre-payment guard: check current status
      const currentStatus = await checkStatus();
      
      if (currentStatus?.subscription_status === 'active' || currentStatus?.subscription_status === 'lifetime') {
        toast.info("You're already on Premium—no payment needed.");
        return;
      }

      // Allow payment to proceed
      if (onPaymentAttempt) {
        onPaymentAttempt();
      }

    } catch (error) {
      console.error('Payment guard check failed:', error);
      toast.error('Unable to verify subscription status. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  // Wrap children and intercept payment attempts
  const wrappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onClick: handlePaymentAttempt,
        disabled: isChecking || isPro,
        children: isChecking 
          ? 'Checking status...' 
          : isPro 
            ? "You're already Premium" 
            : child.props.children
      });
    }
    return child;
  });

  return <>{wrappedChildren}</>;
};