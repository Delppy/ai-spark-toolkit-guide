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
    sm: { width: 'w-24', height: 'h-1', text: 'text-xs', spinner: 'w-8 h-8' },
    md: { width: 'w-32', height: 'h-1.5', text: 'text-sm', spinner: 'w-12 h-12' },
    lg: { width: 'w-40', height: 'h-2', text: 'text-base', spinner: 'w-16 h-16' }
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-purple-600 to-blue-600 overflow-hidden' 
    : '';

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses} ${className}`}>
      {/* Animated background vectors for fullscreen */}
      {fullScreen && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-300/20 rotate-45 animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-32 left-40 w-20 h-20 bg-blue-300/15 rounded-lg animate-spin" style={{animationDuration: '3s'}}></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/5 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          
          {/* Floating lines */}
          <div className="absolute top-1/4 left-1/4 w-64 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-12 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-0.5 bg-gradient-to-r from-transparent via-purple-300/40 to-transparent -rotate-12 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
      )}
      
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Enhanced spinner with gradient */}
        <div className={`relative ${sizeClasses[size].spinner}`}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-spin"></div>
          <div className="absolute inset-1 rounded-full bg-white/90 backdrop-blur"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>

        {/* Progress bar */}
        <div className={`${sizeClasses[size].width} ${sizeClasses[size].height} ${fullScreen ? 'bg-white/20' : 'bg-muted'} rounded-full overflow-hidden backdrop-blur`}>
          <div 
            className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full transition-all duration-300 ease-out animate-pulse"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Percentage Text */}
        <div className={`${sizeClasses[size].text} font-medium ${fullScreen ? 'text-white' : 'text-muted-foreground'} tabular-nums`}>
          {Math.round(percentage)}%
        </div>

        {/* Loading text */}
        {text && (
          <p className={`${sizeClasses[size].text} ${fullScreen ? 'text-white' : 'text-muted-foreground'} font-medium animate-pulse text-center`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;