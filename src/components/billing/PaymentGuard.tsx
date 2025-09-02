import React from 'react';
import { toast } from 'sonner';

interface PaymentGuardProps {
  children: React.ReactNode;
  onPaymentAttempt?: () => void;
}

// Payment guard component that prompts users to upgrade
export const PaymentGuard: React.FC<PaymentGuardProps> = ({ children }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info('Upgrade to Pro to unlock this feature!');
    window.location.href = '/pricing';
  };

  const wrappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onClick: handleClick,
        children: 'Upgrade to Pro',
      });
    }
    return child;
  });

  return <>{wrappedChildren}</>;
};