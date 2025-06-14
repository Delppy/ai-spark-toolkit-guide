
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
  // Home → Deeper pages
  if (from === '/' && ['/school', '/business', '/content', '/career', '/tools', '/prompts'].includes(to)) {
    return 'slide-right';
  }
  
  // Back to Home from deeper pages
  if (['/school', '/business', '/content', '/career', '/tools', '/prompts'].includes(from) && to === '/') {
    return 'slide-left';
  }
  
  // Auth pages (e.g., from anywhere to login)
  if (['/login', '/signup'].includes(to)) {
    return 'slide-up';
  }
  
  // From auth back to app
  if (['/login', '/signup'].includes(from)) {
    return 'fade';
  }
  
  // Profile, settings, and informational pages often use a fade
  if (['/profile', '/about', '/help', '/contact', '/privacy'].includes(to) || ['/profile', '/about', '/help', '/contact', '/privacy'].includes(from)) {
    return 'fade';
  }
  
  // Default transition for any other unhandled case
  return 'fade';
};

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(true); // Start with transition for initial load
  const [direction, setDirection] = useState<TransitionDirection>('fade'); // Initial load is a fade-in
  const [previousPath, setPreviousPath] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    if (previousPath && previousPath !== location.pathname) {
      const newDirection = getTransitionDirection(previousPath, location.pathname);
      setDirection(newDirection);
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // This duration must match the CSS transition duration
      
      return () => clearTimeout(timer);
    } else if (previousPath === '') {
      // Handles the initial page load animation
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
    
    if (previousPath !== location.pathname) {
      setPreviousPath(location.pathname);
    }
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
