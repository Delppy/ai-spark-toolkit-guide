import React from 'react';
import { SHOW_ADS } from '@/config/flags';

interface ProfitableRateAdProps {
  className?: string;
}

// Ad component disabled in free premium mode
export const ProfitableRateAd: React.FC<ProfitableRateAdProps> = ({ className = "" }) => {
  // Never show ads in free premium mode - everything is free
  if (!SHOW_ADS) {
    return null;
  }
  
  // Ad code would go here if ads were enabled
  return null;
};