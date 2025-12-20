import React, { useState, useEffect } from 'react';
import logoImage from "@/assets/logo.png";

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
    sm: { spinner: 'w-16 h-16' },
    md: { spinner: 'w-24 h-24' },
    lg: { spinner: 'w-32 h-32' }
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 bg-background overflow-hidden' 
    : 'min-h-[200px]';

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses} ${className}`}>
      <div className="relative z-10 flex items-center justify-center">
        {/* Logo with circular progress */}
        <div className={`relative flex items-center justify-center ${sizeClasses[size].spinner}`}>
          {/* Circular progress ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
              className="transition-all duration-300 ease-out"
            />
          </svg>
          
          {/* Logo in center */}
          <img 
            src={logoImage} 
            alt="Loading..." 
            className="w-3/4 h-3/4 object-contain animate-pulse"
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;