
import React from 'react';
import { Card, CardProps } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends CardProps {
  interactive?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className, 
  interactive = true,
  ...props 
}) => {
  return (
    <Card
      className={cn(
        "transition-all duration-200 ease-in-out",
        interactive && "hover:scale-102 hover:shadow-lg hover:-translate-y-1",
        interactive && "active:scale-98 active:shadow-md active:translate-y-0",
        interactive && "cursor-pointer",
        "transform-gpu", // Use GPU acceleration
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

export default AnimatedCard;
