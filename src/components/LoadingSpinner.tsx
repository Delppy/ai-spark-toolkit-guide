import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

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
    sm: { width: 'w-24', height: 'h-1', text: 'text-xs', spinner: 'w-8 h-8' },
    md: { width: 'w-32', height: 'h-1.5', text: 'text-sm', spinner: 'w-12 h-12' },
    lg: { width: 'w-40', height: 'h-2', text: 'text-base', spinner: 'w-16 h-16' }
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden' 
    : '';

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses} ${className}`}>
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Simple logo */}
        <div className={`flex items-center justify-center ${sizeClasses[size].spinner}`}>
          <Sparkles className={`${fullScreen ? 'text-white' : 'text-primary'}`} />
        </div>

        {/* Percentage Text */}
        <div className={`${sizeClasses[size].text} font-medium ${fullScreen ? 'text-white' : 'text-muted-foreground'} tabular-nums`}>
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;