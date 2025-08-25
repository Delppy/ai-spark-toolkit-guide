import React from 'react';

// Premium layer disabled: no-op wrapper
export const PremiumSyncGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};