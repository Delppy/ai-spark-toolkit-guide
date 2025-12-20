import React from 'react';
import logoImage from "@/assets/logo.png";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 bg-background' 
    : 'min-h-[200px]';

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses} ${className}`}>
      <img 
        src={logoImage} 
        alt="Loading..." 
        className={`${sizeClasses[size]} object-contain animate-pulse`}
        style={{
          animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      />
      {text && (
        <p className="mt-4 text-muted-foreground text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;