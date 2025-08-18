
export const proFeatures = [
  "🚫 Remove ALL ads",
  "🔓 Access to premium tools",
  "📦 Unlock exclusive tool packs",
  "⚡ Priority tool recommendations",
  "🎯 Advanced filtering options",
  "🆘 Priority support",
];

export const freeFeatures = [
  "Access to basic tools",
  "Limited tool packs",
  "Ad-supported experience",
  "Standard support",
];

// African countries that use GHS pricing
export const AFRICAN_COUNTRIES = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", 
  "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo", "Democratic Republic of the Congo",
  "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia",
  "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya",
  "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia",
  "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone",
  "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
];

// GHS pricing for African countries
export const GHS_MONTHLY_PRICE = 30;
export const GHS_YEARLY_PRICE = 300;

// USD pricing for non-African countries
export const USD_MONTHLY_PRICE = 5.99;
export const USD_YEARLY_PRICE = 59.99;

export const YEARLY_DISCOUNT_PERCENT = Math.round(100 - (USD_YEARLY_PRICE / (USD_MONTHLY_PRICE * 12)) * 100);

// Utility function to detect user's region
export const getUserRegion = async (): Promise<{ country: string; isAfrica: boolean }> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const country = data.country_name || 'Unknown';
    const isAfrica = AFRICAN_COUNTRIES.includes(country);
    return { country, isAfrica };
  } catch (error) {
    console.error('Failed to detect region:', error);
    // Default to non-Africa pricing
    return { country: 'Unknown', isAfrica: false };
  }
};

// Get pricing based on region
export const getPricingForRegion = (isAfrica: boolean) => {
  if (isAfrica) {
    return {
      currency: 'GHS',
      monthly: GHS_MONTHLY_PRICE,
      yearly: GHS_YEARLY_PRICE,
      symbol: 'GHS'
    };
  } else {
    return {
      currency: 'USD',
      monthly: USD_MONTHLY_PRICE,
      yearly: USD_YEARLY_PRICE,
      symbol: '$'
    };
  }
};
