import React, { useState, useEffect } from 'react';

interface FastPageLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const FastPageLoader: React.FC<FastPageLoaderProps> = ({ isLoading, onComplete }) => {
  const [percentage, setPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setPercentage(0);
      
      let currentPercentage = 0;
      const totalDuration = 600; // Very fast - 600ms total
      const updateInterval = 16; // ~60fps
      const totalUpdates = totalDuration / updateInterval;
      
      const interval = setInterval(() => {
        currentPercentage += 100 / totalUpdates;
        
        // Add some randomness for realistic feel but keep it fast
        const randomVariation = (Math.random() - 0.5) * 10;
        const newPercentage = Math.min(currentPercentage + randomVariation, 100);
        
        setPercentage(Math.max(newPercentage, 0));
        
        if (currentPercentage >= 100) {
          clearInterval(interval);
          setPercentage(100);
          
          // Quick fade out
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 100);
        }
      }, updateInterval);

      return () => clearInterval(interval);
    } else {
      setIsVisible(false);
      setPercentage(0);
    }
  }, [isLoading, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="flex flex-col items-center space-y-3">
        {/* Compact Percentage Bar */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-28 h-1 bg-border rounded-full overflow-hidden shadow-sm">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-100 ease-out"
              style={{ 
                width: `${percentage}%`,
                boxShadow: percentage > 5 ? '0 0 6px hsl(var(--primary) / 0.3)' : 'none'
              }}
            />
          </div>
          
          {/* Percentage Text - Small and elegant */}
          <div className="text-xs font-medium text-muted-foreground tabular-nums">
            {Math.round(percentage)}%
          </div>
        </div>

        {/* Optional subtle text */}
        <div className="text-xs text-muted-foreground/60 animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default FastPageLoader;
