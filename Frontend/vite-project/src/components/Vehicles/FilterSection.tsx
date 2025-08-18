import { useState } from 'react';

// Define types
export interface Filters {
  vehicleType: string;
  priceRange: string;
  fuelType: string;
  serviceType: string;
  rating: string;
  rentalType: string;
  brand: string;
  seatCount: string;
  drivingPurpose: string;
  location: string; // Added location filter
  others: string[];
}

interface FilterSectionProps {
  isOpen: boolean;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onApplyFilters: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  isOpen, 
  filters, 
  setFilters, 
  onApplyFilters 
}) => {
  // Initialize all sections as expanded to match the reference image
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    vehicleType: true,
    priceRange: true,
    fuelType: true,
    serviceType: true,
    rentalType: true,
    brand: true,
    rating: true,
    seatCount: true,
    drivingPurpose: true,
    location: true, // Added location section
    others: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (category: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }));
  };

  const resetFilters = () => {
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
      location: '', // Added location reset
      others: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filter</h3>
      </div>

      {/* Vehicle Type Filter */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('vehicleType')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Vehicle Type</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.vehicleType ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.vehicleType && (
          <div className="space-y-1 ml-2">
            {['car', 'van', 'bus', 'suv', 'motorcycle', 'truck'].map((type) => (
              <label key={type} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={type}
                  checked={filters.vehicleType === type}
                  onChange={(e) => handleFilterChange('vehicleType', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('priceRange')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Price Range</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.priceRange ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.priceRange && (
          <div className="px-2">
            <div className="mb-2">
              <input 
                type="range" 
                min="0" 
                max="100" 
                className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="space-y-1">
              {['$0 - $10', '$10 - $20', '$20 - $30', '$30+'].map((range) => (
                <label key={range} className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    value={range}
                    checked={filters.priceRange === range}
                    onChange={(e) => handleFilterChange('priceRange', e.target.checked ? e.target.value : '')}
                    className="mr-2 w-3 h-3"
                  />
                  <span className="text-gray-600">{range}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fuel Type Filter */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('fuelType')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Fuel Type</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.fuelType ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.fuelType && (
          <div className="space-y-1 ml-2">
            {['Petrol', 'Diesel', 'Hybrid', 'Electric vehicle'].map((fuel) => (
              <label key={fuel} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={fuel}
                  checked={filters.fuelType === fuel}
                  onChange={(e) => handleFilterChange('fuelType', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{fuel}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('location')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Location</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.location ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.location && (
          <div className="space-y-1 ml-2">
            {['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara', 'Negombo', 'Anuradhapura', 'Polonnaruwa', 'Batticaloa', 'Kurunegala'].map((city) => (
              <label key={city} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={city}
                  checked={filters.location === city}
                  onChange={(e) => handleFilterChange('location', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{city}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Service Type Filter */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('serviceType')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Service Type</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.serviceType ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.serviceType && (
          <div className="space-y-1 ml-2">
            {['With Driver', 'Without Driver'].map((service) => (
              <label key={service} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={service}
                  checked={filters.serviceType === service}
                  onChange={(e) => handleFilterChange('serviceType', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{service}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rental Type Filter */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('rentalType')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Rental Type</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.rentalType ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.rentalType && (
          <div className="space-y-1 ml-2">
            {['Per Day', 'Per Hour', 'Per KM'].map((rental) => (
              <label key={rental} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={rental}
                  checked={filters.rentalType === rental}
                  onChange={(e) => handleFilterChange('rentalType', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{rental}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('brand')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Brand</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.brand ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.brand && (
          <div className="space-y-1 ml-2">
            {['Toyota', 'Honda', 'Nissan', 'Hyundai', 'Suzuki', 'Mitsubishi', 'Mazda', 'Perodua', 'Proton', 'Ford', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Land Rover', 'Jeep', 'Chevrolet', 'KIA', 'Bajaj', 'TVS', 'Hero', 'Yamaha', 'Kawasaki', 'Ducati', 'Harley', 'Others'].map((brand) => (
              <label key={brand} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={brand}
                  checked={filters.brand === brand}
                  onChange={(e) => handleFilterChange('brand', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('rating')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Ratings</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.rating && (
          <div className="space-y-1 ml-2">
            {['Above 4', 'Above 3', 'Above 2', 'Any Rating'].map((rating) => (
              <label key={rating} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) => handleFilterChange('rating', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{rating}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Driving Purpose Filter */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('drivingPurpose')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Driving Purpose</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.drivingPurpose ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.drivingPurpose && (
          <div className="space-y-1 ml-2">
            {['Long distance touring', 'Short distance touring', 'Local taxi'].map((purpose) => (
              <label key={purpose} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={purpose}
                  checked={filters.drivingPurpose === purpose}
                  onChange={(e) => handleFilterChange('drivingPurpose', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{purpose}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Seat Count Filter */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('seatCount')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Seat count</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.seatCount ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.seatCount && (
          <div className="space-y-1 ml-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Above'].map((count) => (
              <label key={count} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={count}
                  checked={filters.seatCount === count}
                  onChange={(e) => handleFilterChange('seatCount', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{count}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Others Filter */}
      <div className="mb-6">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('others')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Others</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.others ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.others && (
          <div className="space-y-1 ml-2">
            {['Air conditioning', 'Luggage Capacity'].map((other) => (
              <label key={other} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={filters.others.includes(other)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        others: [...prev.others, other]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        others: prev.others.filter((o: string) => o !== other)
                      }));
                    }
                  }}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{other}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={resetFilters}
          className="flex-1 px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={onApplyFilters}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Show Result
        </button>
      </div>
    </div>
  );
};

export { FilterSection };
