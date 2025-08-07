import React, { useState, useEffect } from 'react';
import HotelCard from './HotelCard';
import { FilterSection, type Filters } from './FilterSection';
import hotelBg from '../../assets/hotelbg.png';
import beach2 from '../../assets/beach2.jpg';

import { getApprovedHotels } from '../../api/hotel';

interface HotelType {
  _id: string;
  name: string;
  address: { city?: string; state?: string; country?: string };
  contact?: { phone?: string; email?: string };
  starRating?: number;
  reviews?: unknown[];
  amenities?: string[];
  images?: string[];
  roomTypes?: Array<{ pricePerNight?: number }>;
  hotelType?: string;
}

interface CardData {
  id: string;
  image: string;
  name: string;
  location: string;
  price: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  hotelType: string;
}

const filterButtons: string[] = [
  'Resort Hotels',
  'City Hotels',
  'Homestays',
  'Heritage',
  'Ayurvedic Hotels',
  'Luxury Hotels',
  'Tourist Hotels',
  'Family-Friendly Hotels'
];

const HotelsPage: React.FC = () => {
  const [hotelsData, setHotelsData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
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

  useEffect(() => {
    getApprovedHotels()
      .then((data: HotelType[]) => {
        const mapped: CardData[] = data.map(h => ({
          id: h._id,
          image: h.images?.[0] || beach2,
          name: h.name,
          location: [h.address.city, h.address.state, h.address.country]
            .filter(Boolean)
            .join(', '),
          price: h.roomTypes?.[0]?.pricePerNight
            ? `$${h.roomTypes[0].pricePerNight.toFixed(2)}`
            : 'N/A',
          rating: h.starRating || 0,
          reviewCount: h.reviews?.length || 0,
          tags: h.amenities || [],
          hotelType: h.hotelType || ''
        }));
        setHotelsData(mapped);
      })
      .catch(err => setError(err.message || 'Failed to load hotels'))
      .finally(() => setLoading(false));
  }, []);

  // Filtered list
  const filteredHotels = hotelsData.filter(hotel => {
    let matches = true;
    if (searchQuery) {
      matches = matches && (
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeFilter) {
      matches = matches && hotel.hotelType === activeFilter;
    }
    if (filters.hotelType) {
      matches = matches && hotel.hotelType === filters.hotelType;
    }
    if (filters.location) {
      matches = matches && hotel.location === filters.location;
    }
    if (filters.amenities.length > 0) {
      matches = matches && filters.amenities.some(a => hotel.tags.includes(a));
    }
    if (filters.priceRange) {
      const priceNum = parseFloat(hotel.price.replace('$', ''));
      const [min, max] = filters.priceRange.split(' - ').map(p => parseFloat(p.replace('$','').replace('+','')));
      matches = filters.priceRange.includes('+')
        ? matches && priceNum >= min
        : matches && priceNum >= min && priceNum <= max;
    }
    return matches;
  });

  if (loading) return <div className="my-8 text-center">Loading hotels…</div>;
  if (error) return <div className="my-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white pt-20">
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: `url(${hotelBg})` }}
        />
        <div className="absolute top-10 right-10 w-4 h-4 bg-yellow-300 rounded-full animate-pulse" />
        <div className="absolute top-20 right-32 w-3 h-3 bg-yellow-200 rounded-full animate-pulse delay-100" />
        <div className="absolute top-32 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200" />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <p className="text-blue-200 text-sm mb-2 uppercase tracking-wider">
              FIND THE BEST SERVICE WITH US
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Enjoy the vacation with us
            </h1>
            <div className="max-w-2xl mx-auto mb-6 bg-white rounded-full overflow-hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you looking for ......."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {filterButtons.map(filter => (
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
      {/* Hotels Section - White Background */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="flex items-center justify-between">
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
              <div className="text-center flex-1">
                <p className="text-gray-500 text-sm uppercase tracking-wider">CATEGORY</p>
                <h2 className="text-3xl font-bold text-gray-800">Our Best Hotels</h2>
              </div>
              <div className="w-24" />
            </div>
          </div>
          <div className="flex gap-6">
            <FilterSection
              isOpen={isFilterOpen}
              filters={filters}
              setFilters={setFilters}
              filterButtons={filterButtons}
              onApplyFilters={() => setIsFilterOpen(false)}
            />
            <div className={`${isFilterOpen ? 'flex-1' : 'w-full'}`}>  
              {filteredHotels.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No hotels found.</p>
                  <button
                    onClick={() => {
                      setFilters({ hotelType: '', priceRange: '', location: '', amenities: [], rating: '', roomType: '', famousPlaces: [], offers: [], others: [] });
                      setActiveFilter('');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHotels.map(hotel => (
                    <HotelCard
                      key={hotel.id}
                      id={hotel.id}
                      image={hotel.image}
                      name={hotel.name}
                      location={hotel.location}
                      price={hotel.price}
                      rating={hotel.rating}
                      reviewCount={hotel.reviewCount}
                      tags={hotel.tags}
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

export default HotelsPage;