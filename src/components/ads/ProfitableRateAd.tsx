import React from 'react';
import { SHOW_ADS } from '@/config/flags';

interface ProfitableRateAdProps {
  className?: string;
}

/**
 * ProfitableRateAd component
 * In free premium mode, this component is disabled and returns null
 * since all features are free and ads are not needed
 */
export const ProfitableRateAd: React.FC<ProfitableRateAdProps> = ({ className = "" }) => {
  // Never show ads in free premium mode - everything is free
  if (!SHOW_ADS) {
    return null;
  }
  
  // This code path is unreachable when SHOW_ADS is false
  // Ad implementation would go here if ads were ever re-enabled
  return null;
};