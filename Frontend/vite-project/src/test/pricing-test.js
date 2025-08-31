// Test script to verify 10% markup calculations
// This file can be run in browser console to test the pricing functions

// Mock vehicle data for testing
const testVehicle1 = {
  pricing: {
    pricePerDay: 100,
    pricePerHour: 10,
    pricePerKilometer: 2
  }
};

const testVehicle2 = {
  price: {
    perDay: 50,
    perHour: 5,
    perKilometer: 1
  }
};

// Import pricing functions (would normally be imported)
const PRICE_MARKUP = 0.10;

const applyPriceMarkup = (basePrice) => {
  return Math.round((basePrice * (1 + PRICE_MARKUP)) * 10) / 10;
};

const getMarkedUpPriceForRentalType = (vehicle, rentalType) => {
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

// Test cases
console.log('=== 10% Markup Testing ===');
console.log('');

console.log('Test Vehicle 1 (new pricing structure):');
console.log('Original Daily: $100 -> Marked up:', getMarkedUpPriceForRentalType(testVehicle1, 'daily'), '$ (Expected: $110)');
console.log('Original Hourly: $10 -> Marked up:', getMarkedUpPriceForRentalType(testVehicle1, 'hourly'), '$ (Expected: $11)');
console.log('Original Per Km: $2 -> Marked up:', getMarkedUpPriceForRentalType(testVehicle1, 'kilometer'), '$ (Expected: $2.2)');
console.log('');

console.log('Test Vehicle 2 (legacy pricing structure):');
console.log('Original Daily: $50 -> Marked up:', getMarkedUpPriceForRentalType(testVehicle2, 'daily'), '$ (Expected: $55)');
console.log('Original Hourly: $5 -> Marked up:', getMarkedUpPriceForRentalType(testVehicle2, 'hourly'), '$ (Expected: $5.5)');
console.log('Original Per Km: $1 -> Marked up:', getMarkedUpPriceForRentalType(testVehicle2, 'kilometer'), '$ (Expected: $1.1)');
console.log('');

console.log('Individual markup tests:');
console.log('$100 + 10% =', applyPriceMarkup(100), '(Expected: 110)');
console.log('$50 + 10% =', applyPriceMarkup(50), '(Expected: 55)');
console.log('$10 + 10% =', applyPriceMarkup(10), '(Expected: 11)');
console.log('$5 + 10% =', applyPriceMarkup(5), '(Expected: 5.5)');
console.log('$3 + 10% =', applyPriceMarkup(3), '(Expected: 3.3)');
console.log('$1 + 10% =', applyPriceMarkup(1), '(Expected: 1.1)');
console.log('$2.50 + 10% =', applyPriceMarkup(2.5), '(Expected: 2.8)');
console.log('$0.50 + 10% =', applyPriceMarkup(0.5), '(Expected: 0.6)');

console.log('');
console.log('=== All tests completed ===');
