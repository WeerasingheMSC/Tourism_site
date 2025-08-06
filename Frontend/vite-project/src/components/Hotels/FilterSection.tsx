import { useState } from 'react';

// Define types
interface Filters {
  hotelType: string;
  priceRange: string;
  location: string;
  amenities: string[];
  rating: string;
  roomType: string;
  famousPlaces: string[];
  offers: string[];
  others: string[];
}

interface FilterSectionProps {
  isOpen: boolean;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filterButtons: string[];
  onApplyFilters: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  isOpen, 
  filters, 
  setFilters, 
  filterButtons,
  onApplyFilters 
}) => {
  // Initialize all sections as expanded to match the reference image
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    hotelType: true,
    priceRange: true,
    location: true,
    famousPlaces: true,
    amenities: true,
    rating: true,
    roomType: true,
    offer: true,
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
      hotelType: '',
      priceRange: '',
      location: '',
      amenities: [],
      rating: '',
      roomType: '',
      famousPlaces: [],
      offers: [],
      others: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filter</h3>
      </div>

      {/* Hotel Type Filter */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('hotelType')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Hotel Type</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.hotelType ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.hotelType && (
          <div className="space-y-1 ml-2">
            {filterButtons.map((type) => (
              <label key={type} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={type}
                  checked={filters.hotelType === type}
                  onChange={(e) => handleFilterChange('hotelType', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{type}</span>
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

      {/* Commonly Visited Areas */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('location')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Commonly Visited Areas</h4>
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
            {['Galle', 'Kandy', 'Batticaloa', 'Nuwara Eliya', 'Colombo', 'Trincomalee', 'Bentota', 'Hikkaduwa', 'Mirissa', 'Negombo', 'Polonnaruwa', 'Anuradhapura', 'Jaffna', 'Ratana'].map((location) => (
              <label key={location} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={location}
                  checked={filters.location === location}
                  onChange={(e) => handleFilterChange('location', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{location}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Near Famous places */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('famousPlaces')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Near Famous places</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.famousPlaces ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.famousPlaces && (
          <div className="space-y-1 ml-2">
            {['Temple of Tooth', 'Sigiriya', 'Galle Fort', 'Adams Peak', 'Ella', 'Yala National Park', 'Arugam Bay', 'Pinnawala Elephant Orphanage'].map((place) => (
              <label key={place} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={filters.famousPlaces.includes(place)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        famousPlaces: [...prev.famousPlaces, place]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        famousPlaces: prev.famousPlaces.filter((p: string) => p !== place)
                      }));
                    }
                  }}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{place}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('amenities')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Amenities</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.amenities ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.amenities && (
          <div className="space-y-1 ml-2">
            {['SPA', 'Free Internet', 'Swimming pool', 'Buffet breakfast', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking'].map((amenity) => (
              <label key={amenity} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        amenities: [...prev.amenities, amenity]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        amenities: prev.amenities.filter((a: string) => a !== amenity)
                      }));
                    }
                  }}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{amenity}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
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

      {/* Room Type */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('roomType')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Room Type</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.roomType ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.roomType && (
          <div className="space-y-1 ml-2">
            {['Single', 'Double', 'Suite', 'Family Room'].map((room) => (
              <label key={room} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  value={room}
                  checked={filters.roomType === room}
                  onChange={(e) => handleFilterChange('roomType', e.target.checked ? e.target.value : '')}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{room}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Offer */}
      <div className="mb-4">
        <div 
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => toggleSection('offer')}
        >
          <h4 className="font-medium text-gray-800 text-sm">Offers</h4>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.offer ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {expandedSections.offer && (
          <div className="space-y-1 ml-2">
            {['Seasonal Offers', 'Special Offers'].map((offer) => (
              <label key={offer} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={filters.offers.includes(offer)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({
                        ...prev,
                        offers: [...prev.offers, offer]
                      }));
                    } else {
                      setFilters(prev => ({
                        ...prev,
                        offers: prev.offers.filter((o: string) => o !== offer)
                      }));
                    }
                  }}
                  className="mr-2 w-3 h-3"
                />
                <span className="text-gray-600">{offer}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Others */}
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
            {['Best Sellers', 'Family Friendly'].map((other) => (
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
export type { Filters };