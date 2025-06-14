
import React from 'react';
import { useTransition } from '@/contexts/TransitionContext';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  const { direction, isTransitioning } = useTransition();

  const getTransitionClasses = () => {
    const baseClasses = "transition-all duration-300 ease-out";
    
    if (!isTransitioning) {
      return `${baseClasses} opacity-100 transform translate-x-0 translate-y-0 scale-100`;
    }

    switch (direction) {
      case 'slide-right':
        return `${baseClasses} opacity-0 transform translate-x-12`;
      case 'slide-left':
        return `${baseClasses} opacity-0 transform -translate-x-12`;
      case 'fade':
        return `${baseClasses} opacity-0 transform scale-98`;
      case 'slide-up':
        return `${baseClasses} opacity-0 transform translate-y-12`;
      case 'none':
      default:
        return `${baseClasses} opacity-0`;
    }
  };

  return (
    <div className={cn(getTransitionClasses(), className)}>
      {children}
    </div>
  );
};

export default PageTransition;
