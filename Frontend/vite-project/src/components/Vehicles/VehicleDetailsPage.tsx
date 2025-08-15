import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ChevronDown, Car, MapPin, Phone, Mail, Clock, Users, Fuel, Settings, Palette, Gauge, CheckCircle, XCircle } from 'lucide-react';
import { vehicleService } from '../../api/vehicleBookings';
import type { Vehicle } from '../../api/vehicleBookings';
import { ensureAuthForTesting } from '../../utils/authHelper';

// Import images from assets
import beach2 from '../../assets/beach2.jpg';
import beach4 from '../../assets/beach4.jpg';
import beach5 from '../../assets/beach5.jpg';

const reviews = [
  { id: '1', name: 'Robert DJ', rating: 5.0, date: 'Thu Vehicle 16 h17', avatar: 'R' },
  { id: '2', name: 'Elisa Wirasoef', rating: 5.0, date: 'Thu Vehicle 16 h17', avatar: 'E' },
  { id: '3', name: 'Jane Cooper', rating: 4.2, date: 'Thu Vehicle 16 h17', avatar: 'J' },
  { id: '4', name: 'Kathryn Murphy', rating: 3.0, date: 'Thu Vehicle 16 h17', avatar: 'K' }
];

// Removed static FAQs - will use vehicle.faqs instead

const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) {
        setError('Vehicle ID not provided');
        setLoading(false);
        return;
      }

      try {
        // Ensure authentication for testing
        ensureAuthForTesting();
        
        setLoading(true);
        const response = await vehicleService.getVehicleById(id);
        setVehicle(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error loading vehicle:', err);
        setError(err?.message || 'Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen mt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !vehicle) {
    return (
      <div className="min-h-screen mt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Vehicle not found'}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Helper function to get vehicle name
  const getVehicleName = () => {
    return vehicle.title || vehicle.name || `${vehicle.make || vehicle.brand || ''} ${vehicle.model || ''}`.trim() || 'Vehicle';
  };

  // Helper function to get vehicle price
  const getVehiclePrice = () => {
    if (vehicle.pricing?.pricePerDay) {
      return `$ ${vehicle.pricing.pricePerDay}/Day`;
    }
    if (vehicle.price?.perDay) {
      return ` ${vehicle.price.perDay} $/Day`;
    }
    return '$ 0/Day';
  };

  // Helper function to get vehicle images or use fallbacks
  const getVehicleImages = () => {
    if (vehicle.images && Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      return vehicle.images;
    }
    // Return fallback images only if no real images exist
    const fallbackImages = [
      '/beach2.jpg',           // Public URL
      '/beach3.jpg',           // Public URL  
      '/Sri-Lanka-tourism.jpg', // Public URL
      beach4,                  // Import (should work)
      beach5,                  // Import (should work)
      beach2                   // Import fallback
    ];
    return fallbackImages;
  };

  const vehicleImages = getVehicleImages();

  return (
    <div className="min-h-screen mt-16 lg:mt-20 z-10">
      {/* Breadcrumb */}
      <div className="border-b border-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer">Travel Partner</span>
            <span className="mx-2 text-gray-500">{'>'}</span>
            <span className="hover:text-blue-600 cursor-pointer truncate">Vehicle Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Header and Sidebar Container */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mb-6 lg:mb-8">
          {/* Main Content - Left Side */}
          <div className="flex-1 order-2 lg:order-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm mb-4 lg:mb-6">
              <div className="p-4 lg:p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">{vehicle.make || vehicle.brand || 'Brand'}</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{getVehicleName()}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Car className="w-4 h-4" />
                    <span>{vehicle.vehicleType || vehicle.category || 'Vehicle'}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Registered: {vehicle.registrationNumber || vehicle.licensePlate || 'N/A'} | 
                    Year: {vehicle.year || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                {/* Mobile: Single image carousel */}
                <div className="block lg:hidden">
                  <div className="relative">
                    <img 
                      src={vehicleImages[selectedImage]} 
                      alt={getVehicleName()}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {/* Image counter */}
                    <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                      {selectedImage + 1} / {vehicleImages.length}
                    </div>
                    {/* Navigation arrows */}
                    <button 
                      onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : vehicleImages.length - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"
                    >
                      ←
                    </button>
                    <button 
                      onClick={() => setSelectedImage(selectedImage < vehicleImages.length - 1 ? selectedImage + 1 : 0)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"
                    >
                      →
                    </button>
                  </div>
                  {/* Thumbnail strip */}
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {vehicleImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`View ${index + 1}`}
                        className={`w-16 h-12 object-cover rounded cursor-pointer flex-shrink-0 ${
                          selectedImage === index ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedImage(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Desktop: Grid layout */}
                <div className="hidden lg:block">
                  {/* Top row with main image and right column */}
                  <div className="flex gap-3 mb-3">
                    {/* Main large image */}
                    <div className="relative group cursor-pointer overflow-hidden rounded-lg">
                      <img 
                        src={vehicleImages[selectedImage]} 
                        alt={getVehicleName()}
                        className="w-[560px] h-[375px] object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    </div>
                    
                    {/* Right column - 3 vertical images */}
                    <div className="flex flex-col gap-3">
                      {[1, 2, 3].map((index) => (
                        <div 
                          key={index}
                          className="relative group cursor-pointer overflow-hidden rounded-lg"
                          onClick={() => setSelectedImage(index)}
                        >
                          <img 
                            src={vehicleImages[index] || vehicleImages[0]} 
                            alt={`${getVehicleName()} view ${index}`}
                            className={`w-[180px] h-[120px] object-cover transition-all duration-300 group-hover:scale-105 ${
                              selectedImage === index ? 'ring-2 ring-blue-500' : ''
                            }`}
                          />
                          <div className="absolute inset-0 group-hover:bg-opacity-10 transition-all duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bottom row - 4 horizontal images */}
                  <div className="flex gap-3">
                    {[0, 4, 5, 1].map((index, i) => (
                      <div 
                        key={i}
                        className="relative group cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => setSelectedImage(index)}
                      >
                        <img 
                          src={vehicleImages[index] || vehicleImages[0]} 
                          alt={`${getVehicleName()} view ${index}`}
                          className={`w-[180px] h-[120px] object-cover transition-all duration-300 group-hover:scale-105 ${
                            selectedImage === index ? 'ring-2 ring-blue-500' : ''
                          }`}
                        />
                        <div className="absolute inset-0 group-hover:bg-opacity-10 transition-all duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 flex flex-col order-1 lg:order-2">
            {/* Priority Highlights */}
            <div className="relative rounded-xl overflow-hidden mb-4 lg:mb-6 border border-black/10">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              
              <div className="relative z-10 p-4 lg:p-6 text-black">
                {/* Vehicle Specifications */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Specifications</h3>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      AC :
                    </span>
                    <span className="text-sm font-medium flex items-center gap-1">
                      {vehicle.features?.includes('Air Conditioning') || vehicle.airConditioning ? (
                        <><CheckCircle className="w-4 h-4 text-green-500" /> Yes</>
                      ) : (
                        <><XCircle className="w-4 h-4 text-red-500" /> No</>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Fuel className="w-4 h-4" />
                      Fuel Type :
                    </span>
                    <span className="text-sm font-medium">{vehicle.fuelType || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Seat count :
                    </span>
                    <span className="text-sm font-medium">{vehicle.seatCapacity || vehicle.seatingCapacity || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Transmission :
                    </span>
                    <span className="text-sm font-medium">{vehicle.transmission || 'N/A'}</span>
                  </div>
                  
                  {vehicle.color && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Color :
                      </span>
                      <span className="text-sm font-medium">{vehicle.color}</span>
                    </div>
                  )}
                  
                  {vehicle.mileage && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        Mileage :
                      </span>
                      <span className="text-sm font-medium">{vehicle.mileage} km</span>
                    </div>
                  )}
                  
                  {vehicle.location?.city && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location :
                      </span>
                      <span className="text-sm font-medium">{vehicle.location.city}</span>
                    </div>
                  )}
                  
                  {vehicle.location?.area && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Area :
                      </span>
                      <span className="text-sm font-medium">{vehicle.location.area}</span>
                    </div>
                  )}
                </div>

                {/* Vehicle Features */}
                {vehicle.features && vehicle.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {vehicle.features.slice(0, 4).map((feature, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                      {vehicle.features.length > 4 && (
                        <span className="text-xs text-gray-500">+{vehicle.features.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-bold mb-2">{getVehiclePrice()}</div>
                </div>

                {/* Book Now Button */}
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4">
                  Book Now
                </button>

                {/* Contact Information */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Owner</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>+94 77 123 4567</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>owner@example.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Available 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Display */}
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-4 lg:p-6 mb-4">
              <div className="flex items-center justify-between text-white">
                {/* Left side - Rating score and star */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl lg:text-4xl font-bold">4.5</span>
                    <Star className="w-4 lg:w-6 h-4 lg:h-6 fill-white text-white" />
                  </div>
                  <p className="text-xs lg:text-sm text-blue-100">0 reviews</p>
                </div>
                
                {/* Right side - Rating bars */}
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-1 lg:gap-2">
                      <span className="text-xs text-white w-2">{rating}</span>
                      <Star className="w-2 lg:w-3 h-2 lg:h-3 fill-white text-white" />
                      <div className="w-12 lg:w-20 h-1 lg:h-1.5 bg-blue-300 rounded-full">
                        <div 
                          className="h-full bg-white rounded-full"
                          style={{ 
                            width: rating === 5 ? '85%' : 
                                   rating === 4 ? '12%' : 
                                   rating === 3 ? '2%' : 
                                   rating === 2 ? '1%' : '0%' 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Content Section */}
        <div className="max-w-7xl mx-auto">
          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Reviews</h2>
            
            {/* Individual Reviews */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-2 border-blue-200 rounded-lg p-3 lg:p-4 bg-white">
                  {/* Top section: Profile image left, name and rating right */}
                  <div className="flex items-start gap-2 lg:gap-3 mb-2 lg:mb-3">
                    <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={`https://images.unsplash.com/photo-${review.id === '1' ? '1472099645785-5658abf4ff4e' : review.id === '2' ? '1494790108755-2616c01c5944' : review.id === '3' ? '1517841905240-472988babdf9' : '1438761681033-6461ffad8d80'}?w=48&h=48&fit=crop&crop=face`}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="font-semibold text-gray-900 text-xs lg:text-sm mb-1 truncate">{review.name}</h4>
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-2.5 lg:w-3 h-2.5 lg:h-3 fill-blue-400 text-blue-400" />
                        <span className="font-semibold text-xs lg:text-sm text-blue-600">{review.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom section: Review text left aligned */}
                  <div className="text-left">
                    <p className="text-xs text-gray-500 mb-1">Super recommended product.</p>
                    <p className="text-xs text-gray-400">You have to try!</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description About Vehicle */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Description About Vehicle</h2>
            <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
              <p>{vehicle.description || 'This is a reliable and well-maintained vehicle perfect for your travel needs. Whether you\'re planning a city tour, long-distance journey, or special occasion transport, this vehicle offers comfort, safety, and convenience for all passengers.'}</p>
            </div>
          </div>

          {/* Vehicle Location */}
          {vehicle.location && (vehicle.location.city || vehicle.location.area || vehicle.location.address) && (
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Vehicle Location
              </h2>
              <div className="text-gray-700 leading-relaxed text-sm lg:text-base">
                <div className="space-y-2">
                  {vehicle.location.city && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 w-16">City:</span>
                      <span>{vehicle.location.city}</span>
                    </div>
                  )}
                  {vehicle.location.area && (
                    <div className="flex items-center">
                      <span className="font-medium text-gray-600 w-16">Area:</span>
                      <span>{vehicle.location.area}</span>
                    </div>
                  )}
                  {vehicle.location.address && (
                    <div className="flex items-start">
                      <span className="font-medium text-gray-600 w-16">Address:</span>
                      <span className="flex-1">{vehicle.location.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* All Vehicle Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Vehicle Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rental Terms & Pricing */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Rental Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Day:</span>
                    <span className="font-semibold">{getVehiclePrice()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Vehicle Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Type:</span>
                    <span className="font-semibold">{vehicle.vehicleType || vehicle.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-semibold">{vehicle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">License Plate:</span>
                    <span className="font-semibold">{vehicle.licensePlate || vehicle.registrationNumber}</span>
                  </div>
                  {vehicle.available !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Availability:</span>
                      <span className={`font-semibold ${vehicle.available ? 'text-green-600' : 'text-red-600'}`}>
                        {vehicle.available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Complete Vehicle Information - All RegisterVehicle form details */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Complete Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Vehicle Name</span>
                    <span className="font-medium">{getVehicleName()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Category/Type</span>
                    <span className="font-medium">{vehicle.vehicleType || vehicle.category || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Brand/Make</span>
                    <span className="font-medium">{vehicle.brand || vehicle.make || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Model</span>
                    <span className="font-medium">{vehicle.model || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Year</span>
                    <span className="font-medium">{vehicle.year || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">License Plate</span>
                    <span className="font-medium">{vehicle.licensePlate || vehicle.registrationNumber || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Details & Specifications */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Vehicle Specifications</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Seating Capacity</span>
                    <span className="font-medium">{vehicle.seatingCapacity || vehicle.seatCapacity || 'N/A'} passengers</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Fuel Type</span>
                    <span className="font-medium">{vehicle.fuelType || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Transmission</span>
                    <span className="font-medium">{vehicle.transmission || 'N/A'}</span>
                  </div>
                  {vehicle.color && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Color</span>
                      <span className="font-medium">{vehicle.color}</span>
                    </div>
                  )}
                  {vehicle.mileage && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Current Mileage</span>
                      <span className="font-medium">{vehicle.mileage} km</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Air Conditioning</span>
                    <span className={`font-medium ${vehicle.airConditioning || vehicle.features?.includes('Air Conditioning') ? 'text-green-600' : 'text-red-600'}`}>
                      {vehicle.airConditioning || vehicle.features?.includes('Air Conditioning') ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location & Availability */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Location & Availability</h3>
                <div className="space-y-3">
                  {vehicle.location?.city && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">City</span>
                      <span className="font-medium">{vehicle.location.city}</span>
                    </div>
                  )}
                  {vehicle.location?.area && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Area</span>
                      <span className="font-medium">{vehicle.location.area}</span>
                    </div>
                  )}
                  {vehicle.location?.address && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Full Address</span>
                      <span className="font-medium text-sm">{vehicle.location.address}</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Rental Price</span>
                    <span className="font-medium text-blue-600">{getVehiclePrice()}</span>
                  </div>
                  {vehicle.available !== undefined && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Current Status</span>
                      <span className={`font-medium ${vehicle.available ? 'text-green-600' : 'text-red-600'}`}>
                        {vehicle.available ? 'Available for Rental' : 'Currently Unavailable'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* FAQs About Vehicle */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">FAQs About Vehicle</h2>
            
            {vehicle.faqs && vehicle.faqs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                {vehicle.faqs.map((faq: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-3 lg:p-4 text-left hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900 text-sm lg:text-base">{faq.question}</span>
                      <ChevronDown 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedFAQ === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-3 lg:px-4 pb-3 lg:pb-4 text-gray-600 text-sm lg:text-base">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No FAQs available for this vehicle.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
