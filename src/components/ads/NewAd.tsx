import React from 'react';
import { SHOW_ADS } from '@/config/flags';

interface NewAdProps {
  className?: string;
}

// Ad component disabled in free premium mode
export const NewAd: React.FC<NewAdProps> = ({ className = "" }) => {
  // Never show ads in free premium mode
  if (!SHOW_ADS) {
    return null;
  }
  
  // Ad code would go here if ads were enabled
  return null;
};