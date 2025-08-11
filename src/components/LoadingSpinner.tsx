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
      {/* Animated background vectors for fullscreen */}
      {fullScreen && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Morphing geometric shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 animate-morph-circle"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-primary/20 animate-morph-square" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-32 left-40 w-20 h-20 bg-secondary/15 animate-morph-triangle" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/5 animate-morph-hexagon" style={{animationDelay: '1.5s'}}></div>
          
          {/* AiToUse logo morphing animation */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-24 h-24">
              {/* Circle that morphs into logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full animate-morph-to-logo"></div>
              {/* AiToUse logo that fades in */}
              <div className="absolute inset-0 flex items-center justify-center animate-logo-reveal">
                <Sparkles className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Floating lines that morph */}
          <div className="absolute top-1/4 left-1/4 w-64 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-morph-line-1"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-morph-line-2" style={{animationDelay: '1.5s'}}></div>
        </div>
      )}
      
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Enhanced AiToUse logo with gradient and morphing effects */}
        <div className={`relative flex items-center justify-center ${sizeClasses[size].spinner}`}>
          <div className="relative">
            <Sparkles className="w-16 h-16 text-white animate-ai-morph" />
            <div className="absolute inset-0 w-16 h-16">
              <Sparkles className="w-16 h-16 text-primary animate-ai-morph-delay" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg animate-ai-glow"></div>
        </div>

        {/* Progress bar */}
        <div className={`${sizeClasses[size].width} ${sizeClasses[size].height} ${fullScreen ? 'bg-white/20' : 'bg-muted'} rounded-full overflow-hidden backdrop-blur`}>
          <div 
            className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-300 ease-out animate-pulse"
            style={{ width: `${percentage}%` }}
          />
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