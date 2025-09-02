/**
 * Global Feature Flags
 * 
 * This file controls the availability of premium features across the app.
 * When IS_PREMIUM_FREE is true, all premium features are available to all users
 * without authentication or payment requirements.
 */

// PREMIUM MODE: Users need to pay for premium features
export const IS_PREMIUM_FREE = false;

// Show ads: false when premium is free
export const SHOW_ADS = !IS_PREMIUM_FREE;

// Auth requirements: false when premium is free
export const REQUIRE_AUTH_FOR_PREMIUM = !IS_PREMIUM_FREE;

// Credit limits: unlimited when premium is free
export const FREE_USER_CREDITS = IS_PREMIUM_FREE ? Infinity : 5;
export const MAX_FREE_CREDITS = IS_PREMIUM_FREE ? Infinity : 5;