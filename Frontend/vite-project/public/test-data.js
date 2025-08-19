// Sample data creation script for testing Vehicle Dashboard
// Run this in browser console or create API endpoints to populate test data

const API_BASE = 'http://localhost:5001/api';

// Sample vehicles data
const sampleVehicles = [
  {
    name: 'Toyota Prius',
    licensePlate: 'CAR-001',
    category: 'car',
    brand: 'Toyota',
    model: 'Prius',
    year: 2023,
    seatingCapacity: 5,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'GPS', 'Bluetooth'],
    images: [],
    pricing: {
      pricePerDay: 45,
      pricePerKm: 0.5,
      driverFee: 25
    },
    location: {
      city: 'Colombo',
      area: 'Bambalapitiya'
    },
    available: true,
    description: 'Fuel-efficient hybrid car perfect for city driving'
  },
  {
    name: 'Toyota Hiace Van',
    licensePlate: 'VAN-002',
    category: 'van',
    brand: 'Toyota',
    model: 'Hiace',
    year: 2022,
    seatingCapacity: 12,
    fuelType: 'Diesel',
    transmission: 'Manual',
    features: ['Air Conditioning', 'GPS', 'Comfortable Seating'],
    images: [],
    pricing: {
      pricePerDay: 75,
      pricePerKm: 0.8,
      driverFee: 35
    },
    location: {
      city: 'Kandy',
      area: 'Temple Street'
    },
    available: true,
    description: 'Spacious van ideal for group travel'
  },
  {
    name: 'Mercedes Benz Sprinter',
    licensePlate: 'BUS-003',
    category: 'bus',
    brand: 'Mercedes Benz',
    model: 'Sprinter',
    year: 2021,
    seatingCapacity: 20,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    features: ['Air Conditioning', 'GPS', 'WiFi', 'Entertainment System'],
    images: [],
    pricing: {
      pricePerDay: 120,
      pricePerKm: 1.2,
      driverFee: 50
    },
    location: {
      city: 'Galle',
      area: 'Fort'
    },
    available: false,
    unavailabilityReason: 'Maintenance',
    description: 'Luxury bus for large group travel'
  }
];

// Sample bookings data
const sampleBookings = [
  {
    customer: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+94771234567',
      address: '123 Main Street, Colombo'
    },
    booking: {
      startDate: new Date('2024-12-20'),
      endDate: new Date('2024-12-23'),
      pickupLocation: 'Bandaranaike International Airport',
      dropoffLocation: 'Galle Face Hotel',
      pickupTime: '10:00 AM',
      dropoffTime: '6:00 PM',
      driverRequired: true
    },
    pricing: {
      basePrice: 135,
      driverFee: 75,
      taxes: 21,
      totalAmount: 231
    },
    payment: {
      method: 'card',
      status: 'paid',
      advanceAmount: 100,
      remainingAmount: 131,
      transactionId: 'TXN-12345'
    },
    status: 'confirmed',
    notes: 'Airport pickup required'
  }
];

// Function to create sample vehicles
async function createSampleVehicles() {
  const token = localStorage.getItem('token');
  
  for (const vehicle of sampleVehicles) {
    try {
      const response = await fetch(`${API_BASE}/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(vehicle)
      });
      
      const result = await response.json();
      console.log('Created vehicle:', result);
    } catch (error) {
      console.error('Error creating vehicle:', error);
    }
  }
}

// Function to create sample bookings
async function createSampleBookings() {
  const token = localStorage.getItem('token');
  
  // First, get available vehicles
  try {
    const vehiclesResponse = await fetch(`${API_BASE}/vehicles`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const vehiclesData = await vehiclesResponse.json();
    const vehicles = vehiclesData.data || [];
    
    if (vehicles.length > 0) {
      const booking = {
        ...sampleBookings[0],
        vehicleId: vehicles[0]._id
      };
      
      const response = await fetch(`${API_BASE}/vehicle-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(booking)
      });
      
      const result = await response.json();
      console.log('Created booking:', result);
    }
  } catch (error) {
    console.error('Error creating booking:', error);
  }
}

// Instructions for use:
console.log(`
Vehicle Dashboard Test Data Creator
===================================

To create sample data:
1. Make sure you're logged in and have a token in localStorage
2. Run: createSampleVehicles()
3. Run: createSampleBookings()

Available functions:
- createSampleVehicles() - Creates 3 sample vehicles
- createSampleBookings() - Creates 1 sample booking

Sample vehicles include:
- Toyota Prius (Car)
- Toyota Hiace Van (Van) 
- Mercedes Sprinter (Bus)
`);

// Export functions for manual use
window.createSampleVehicles = createSampleVehicles;
window.createSampleBookings = createSampleBookings;
