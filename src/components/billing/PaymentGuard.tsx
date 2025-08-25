import React from 'react';
import { toast } from 'sonner';

interface PaymentGuardProps {
  children: React.ReactNode;
  onPaymentAttempt?: () => void;
}

// Premium layer disabled: pass-through component that blocks payments and informs user
export const PaymentGuard: React.FC<PaymentGuardProps> = ({ children }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info('All features are now free. No payment needed.');
  };

  const wrappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        onClick: handleClick,
        children: 'All features are free',
      });
    }
    return child;
  });

  return <>{wrappedChildren}</>;
};