import React, { Suspense, ComponentType } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback,
  errorFallback 
}) => {
  const defaultFallback = fallback || (
    <div className="min-h-[400px] flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );

  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Higher-order component for lazy loading
export const withLazyLoading = <T extends Record<string, any>>(
  Component: ComponentType<T>,
  loadingText?: string
) => {
  const WrappedComponent = (props: T) => (
    <LazyWrapper 
      fallback={
        <div className="min-h-[200px] flex items-center justify-center">
          <LoadingSpinner size="md" text={loadingText || "Loading component..."} />
        </div>
      }
    >
      <Component {...props} />
    </LazyWrapper>
  );
  
  WrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

export default LazyWrapper;