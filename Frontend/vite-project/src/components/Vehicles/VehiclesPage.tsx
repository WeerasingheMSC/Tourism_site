import { useState } from 'react';
import VehicleCard from './VehicleCard';
import { FilterSection, type Filters } from './FilterSection';
import vehicleBg from '../../assets/vehiclebg.png';
import beach2 from '../../assets/beach2.jpg';
import beach3 from '../../assets/beach3.jpg';
import beach4 from '../../assets/beach4.jpg';
import beach5 from '../../assets/beach5.jpg';
import sriLankaTourism from '../../assets/Sri-Lanka-tourism.jpg';
import sriLankaTravelTips from '../../assets/Sri-Lanka-Travel-Tips-Things-to-Do-in-Sri-Lanka-12.jpeg';

// Define types
interface Vehicle {
  id: string;
  image: string;
  name: string;
  brand: string;
  price: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  vehicleType: string;
  fuelType: string;
  serviceType: string;
  rentalType: string;
  seatCount: string;
  drivingPurpose: string;
}

// Sample vehicle data
const vehiclesData: Vehicle[] = [
  {
    id: '1',
    image: beach2,
    name: 'Name of the vehicle',
    brand: 'Toyota',
    price: '$12/day',
    rating: 4.5,
    reviewCount: 200,
    tags: ['Luxury', 'Free insurance'],
    vehicleType: 'Car',
    fuelType: 'Petrol',
    serviceType: 'With Driver',
    rentalType: 'Per Day',
    seatCount: '5',
    drivingPurpose: 'Long distance touring'
  },
  {
    id: '2',
    image: beach3,
    name: 'Name of the vehicle',
    brand: 'Honda',
    price: '$29/day',
    rating: 4.5,
    reviewCount: 201,
    tags: ['Free insurance', 'GPS'],
    vehicleType: 'Van',
    fuelType: 'Diesel',
    serviceType: 'Without Driver',
    rentalType: 'Per Day',
    seatCount: '8',
    drivingPurpose: 'Short distance'
  },
  {
    id: '3',
    image: beach4,
    name: 'Name of the vehicle',
    brand: 'Nissan',
    price: '$11.70/day',
    rating: 4.5,
    reviewCount: 200,
    tags: ['Luxury', 'Free insurance', 'Air Conditioning'],
    vehicleType: 'SUV',
    fuelType: 'Hybrid',
    serviceType: 'With Driver',
    rentalType: 'Per Day',
    seatCount: '7',
    drivingPurpose: 'Long distance touring'
  },
  {
    id: '4',
    image: beach5,
    name: 'Name of the vehicle',
    brand: 'Mitsubishi',
    price: '$8.99/day',
    rating: 4.5,
    reviewCount: 200,
    tags: ['Luxury', 'Free insurance', 'GPS'],
    vehicleType: 'Tuk Tuk',
    fuelType: 'Petrol',
    serviceType: 'With Driver',
    rentalType: 'Per Hour',
    seatCount: '3',
    drivingPurpose: 'Short distance'
  },
  {
    id: '5',
    image: sriLankaTourism,
    name: 'Name of the vehicle',
    brand: 'Toyota',
    price: '$14.81/day',
    rating: 4.5,
    reviewCount: 200,
    tags: ['Luxury', 'Free insurance'],
    vehicleType: 'Bus',
    fuelType: 'Diesel',
    serviceType: 'With Driver',
    rentalType: 'Per Day',
    seatCount: '25',
    drivingPurpose: 'Long distance touring'
  },
  {
    id: '6',
    image: sriLankaTravelTips,
    name: 'Name of the vehicle',
    brand: 'Honda',
    price: '$6.48/day',
    rating: 4.5,
    reviewCount: 201,
    tags: ['Luxury', 'Free insurance', 'GPS'],
    vehicleType: 'Bike',
    fuelType: 'Petrol',
    serviceType: 'Without Driver',
    rentalType: 'Per Day',
    seatCount: '2',
    drivingPurpose: 'Short distance'
  }
];

const filterButtons: string[] = [
  'Car',
  'Van',
  'SUV',
  'Bus',
  'Bike',
  'Tuk Tuk',
  'Long drive vehicle',
  'Luxury vehicle'
];

const VehiclesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    vehicleType: '',
    priceRange: '',
    fuelType: '',
    serviceType: '',
    rating: '',
    rentalType: '',
    brand: '',
    seatCount: '',
    drivingPurpose: '',
    others: []
  });

  // Filter vehicles based on active filters
  const filteredVehicles = vehiclesData.filter(vehicle => {
    let matches = true;

    // Search query filter
    if (searchQuery) {
      matches = matches && (
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Active filter button
    if (activeFilter) {
      matches = matches && vehicle.vehicleType === activeFilter;
    }

    // Sidebar filters
    if (filters.vehicleType) {
      matches = matches && vehicle.vehicleType === filters.vehicleType;
    }

    if (filters.brand) {
      matches = matches && vehicle.brand === filters.brand;
    }

    if (filters.fuelType) {
      matches = matches && vehicle.fuelType === filters.fuelType;
    }

    if (filters.serviceType) {
      matches = matches && vehicle.serviceType === filters.serviceType;
    }

    if (filters.rentalType) {
      matches = matches && vehicle.rentalType === filters.rentalType;
    }

    if (filters.seatCount) {
      matches = matches && vehicle.seatCount === filters.seatCount;
    }

    if (filters.drivingPurpose) {
      matches = matches && vehicle.drivingPurpose === filters.drivingPurpose;
    }

    if (filters.priceRange) {
      const price = parseFloat(vehicle.price.replace('$', '').split('/')[0]);
      const [min, max] = filters.priceRange.split(' - ').map((p: string) => parseFloat(p.replace('$', '').replace('+', '')));
      if (filters.priceRange.includes('+')) {
        matches = matches && price >= min;
      } else {
        matches = matches && price >= min && price <= max;
      }
    }

    return matches;
  });

  return (
    <div className="bg-white pt-20">
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden">
        {/* Background Image/Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{
            backgroundImage: `url(${vehicleBg})`
          }}
        />
        
        {/* Decorative Lights */}
        <div className="absolute top-10 right-10 w-4 h-4 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-32 w-3 h-3 bg-yellow-200 rounded-full animate-pulse delay-100"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            <p className="text-blue-200 text-sm mb-2 uppercase tracking-wider">
              FIND THE BEST SERVICE WITH US
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Enjoy the vacation with us
            </h1>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6 bg-white rounded-full overflow-hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for ......."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {filterButtons.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(activeFilter === filter ? '' : filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-500 text-white hover:bg-blue-400'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Vehicles Section - White Background */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              {/* Filter Button */}
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  isFilterOpen 
                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                    : 'text-blue-500 border-blue-500 hover:bg-blue-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                {isFilterOpen ? 'Hide Filter' : 'Filter'}
              </button>
              
              {/* Centered Heading */}
              <div className="text-center flex-1">
                <p className="text-gray-500 text-sm uppercase tracking-wider">CATEGORY</p>
                <h2 className="text-3xl font-bold text-gray-800">Our Travel Partners</h2>
              </div>
              
              {/* Empty space for balance */}
              <div className="w-24"></div>
            </div>
          </div>
          
          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <FilterSection 
              isOpen={isFilterOpen}
              filters={filters}
              setFilters={setFilters}
              onApplyFilters={() => setIsFilterOpen(false)}
            />
            
            {/* Vehicles Grid */}
            <div className={`${isFilterOpen ? 'flex-1' : 'w-full'}`}>
              {filteredVehicles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No vehicles found matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setFilters({
                        vehicleType: '',
                        priceRange: '',
                        fuelType: '',
                        serviceType: '',
                        rating: '',
                        rentalType: '',
                        brand: '',
                        seatCount: '',
                        drivingPurpose: '',
                        others: []
                      });
                      setActiveFilter('');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      id={vehicle.id}
                      image={vehicle.image}
                      name={vehicle.name}
                      brand={vehicle.brand}
                      price={vehicle.price}
                      rating={vehicle.rating}
                      reviewCount={vehicle.reviewCount}
                      tags={vehicle.tags}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclesPage;
