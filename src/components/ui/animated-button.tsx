
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  ripple?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  className, 
  ripple = true, 
  ...props 
}) => {
  return (
    <Button
      className={cn(
        "transition-all duration-200 ease-in-out",
        "hover:scale-105 hover:shadow-md",
        "active:scale-95 active:shadow-sm",
        ripple && "relative overflow-hidden",
        ripple && "before:absolute before:inset-0 before:bg-white/20 before:scale-0 before:rounded-full before:transition-transform before:duration-300",
        ripple && "active:before:scale-100",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default AnimatedButton;
