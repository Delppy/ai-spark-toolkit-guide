
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type TransitionDirection = 'slide-right' | 'slide-left' | 'fade' | 'slide-up' | 'none';

interface TransitionContextType {
  isTransitioning: boolean;
  direction: TransitionDirection;
  setTransition: (direction: TransitionDirection) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

const getTransitionDirection = (from: string, to: string): TransitionDirection => {
  // Home → Category: slide right
  if (from === '/' && ['/school', '/business', '/content', '/career'].includes(to)) {
    return 'slide-right';
  }
  
  // Category → Back to Home: slide left
  if (['/school', '/business', '/content', '/career'].includes(from) && to === '/') {
    return 'slide-left';
  }
  
  // Profile related: fade
  if (to === '/profile' || from === '/profile') {
    return 'fade';
  }
  
  // About, Help: fade
  if (['/about', '/help'].includes(to) || ['/about', '/help'].includes(from)) {
    return 'fade';
  }
  
  // Tools, Prompts: slide right
  if (from === '/' && ['/tools', '/prompts'].includes(to)) {
    return 'slide-right';
  }
  
  // Back from Tools, Prompts: slide left
  if (['/tools', '/prompts'].includes(from) && to === '/') {
    return 'slide-left';
  }
  
  return 'none';
};

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<TransitionDirection>('none');
  const [previousPath, setPreviousPath] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    if (previousPath && previousPath !== location.pathname) {
      const newDirection = getTransitionDirection(previousPath, location.pathname);
      setDirection(newDirection);
      setIsTransitioning(true);
      
      // Reset transition state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
    setPreviousPath(location.pathname);
  }, [location.pathname, previousPath]);

  const setTransition = (newDirection: TransitionDirection) => {
    setDirection(newDirection);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, direction, setTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};
