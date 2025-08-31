/**
 * Utility functions for vehicle pricing with 10% markup
 * Vehicle owners set base prices, customers see prices with 10% markup
 */

export const PRICE_MARKUP = 0.10; // 10% markup

/**
 * Apply 10% markup to a base price
 * @param basePrice - The original price set by vehicle owner
 * @returns The marked-up price for customers with decimal precision
 */
export const applyPriceMarkup = (basePrice: number): number => {
  return Math.round((basePrice * (1 + PRICE_MARKUP)) * 10) / 10;
};

/**
 * Calculate the base price from marked-up price
 * @param markedUpPrice - The price shown to customers (with markup)
 * @returns The original base price
 */
export const calculateBasePrice = (markedUpPrice: number): number => {
  return Math.round(markedUpPrice / (1 + PRICE_MARKUP));
};

/**
 * Get vehicle price with markup for display to customers
 * Supports both legacy and new pricing structures
 */
export const getVehiclePriceWithMarkup = (vehicle: any) => {
  // Check new pricing structure first
  if (vehicle.pricing?.pricePerDay) {
    return `${applyPriceMarkup(vehicle.pricing.pricePerDay)}$/day`;
  }
  if (vehicle.pricing?.pricePerHour) {
    return `${applyPriceMarkup(vehicle.pricing.pricePerHour)}$/hour`;
  }
  if (vehicle.pricing?.pricePerKilometer) {
    return `${applyPriceMarkup(vehicle.pricing.pricePerKilometer)}$/km`;
  }
  
  // Check legacy pricing structure
  if (vehicle.price?.perDay) {
    return `${applyPriceMarkup(vehicle.price.perDay)}$/day`;
  }
  if (vehicle.price?.perHour) {
    return `${applyPriceMarkup(vehicle.price.perHour)}$/hour`;
  }
  if (vehicle.price?.perKilometer) {
    return `${applyPriceMarkup(vehicle.price.perKilometer)}$/km`;
  }
  
  return 'Price on request';
};

/**
 * Get all available pricing options with markup for a vehicle
 */
export const getVehiclePricingOptionsWithMarkup = (vehicle: any) => {
  const options = [];
  
  // Check new pricing structure
  if (vehicle.pricing?.pricePerDay) {
    options.push(`Daily: ${applyPriceMarkup(vehicle.pricing.pricePerDay)}$/day`);
  }
  if (vehicle.pricing?.pricePerHour) {
    options.push(`Hourly: ${applyPriceMarkup(vehicle.pricing.pricePerHour)}$/hour`);
  }
  if (vehicle.pricing?.pricePerKilometer) {
    options.push(`Per Km: ${applyPriceMarkup(vehicle.pricing.pricePerKilometer)}$/km`);
  }
  
  // Check legacy pricing structure if no new pricing
  if (options.length === 0) {
    if (vehicle.price?.perDay) {
      options.push(`Daily: ${applyPriceMarkup(vehicle.price.perDay)}$/day`);
    }
    if (vehicle.price?.perHour) {
      options.push(`Hourly: ${applyPriceMarkup(vehicle.price.perHour)}$/hour`);
    }
    if (vehicle.price?.perKilometer) {
      options.push(`Per Km: ${applyPriceMarkup(vehicle.price.perKilometer)}$/km`);
    }
  }
  
  return options;
};

/**
 * Get marked-up price for a specific rental type
 */
export const getMarkedUpPriceForRentalType = (vehicle: any, rentalType: 'daily' | 'hourly' | 'kilometer'): number => {
  let basePrice = 0;
  
  if (rentalType === 'daily') {
    basePrice = vehicle.pricing?.pricePerDay || vehicle.price?.perDay || 0;
  } else if (rentalType === 'hourly') {
    basePrice = vehicle.pricing?.pricePerHour || vehicle.price?.perHour || 0;
  } else if (rentalType === 'kilometer') {
    basePrice = vehicle.pricing?.pricePerKilometer || vehicle.price?.perKilometer || 0;
  }
  
  return applyPriceMarkup(basePrice);
};
