import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
  duration?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  fullScreen = false,
  className = '',
  duration = 800
}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Fast acceleration at start, smooth completion
        const increment = prev < 60 ? Math.random() * 15 + 10 : Math.random() * 8 + 3;
        return Math.min(prev + increment, 100);
      });
    }, duration / 20);

    return () => clearInterval(interval);
  }, [duration]);

  const sizeClasses = {
    sm: { width: 'w-24', height: 'h-1', text: 'text-xs' },
    md: { width: 'w-32', height: 'h-1.5', text: 'text-sm' },
    lg: { width: 'w-40', height: 'h-2', text: 'text-base' }
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        {/* Percentage Bar */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`${sizeClasses[size].width} ${sizeClasses[size].height} bg-muted rounded-full overflow-hidden shadow-sm`}>
            <div 
              className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary rounded-full transition-all duration-300 ease-out shadow-glow"
              style={{ 
                width: `${percentage}%`,
                boxShadow: percentage > 10 ? '0 0 8px hsl(var(--primary) / 0.4)' : 'none'
              }}
            />
          </div>
          
          {/* Percentage Text */}
          <div className={`${sizeClasses[size].text} font-medium text-muted-foreground tabular-nums`}>
            {Math.round(percentage)}%
          </div>
        </div>

        {/* Custom Text */}
        {text && (
          <p className={`${sizeClasses[size].text} text-muted-foreground font-medium animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;