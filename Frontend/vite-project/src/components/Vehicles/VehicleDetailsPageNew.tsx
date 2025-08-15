import { useState } from 'react';
import { Star, MapPin, ChevronDown, Calendar, Users, CreditCard, Car, Fuel } from 'lucide-react';

// Import images from assets
import beach2 from '../../assets/beach2.jpg';
import beach3 from '../../assets/beach3.jpg';
import beach4 from '../../assets/beach4.jpg';
import beach5 from '../../assets/beach5.jpg';
import sriLankaTourism from '../../assets/Sri-Lanka-tourism.jpg';
import sriLankaTravelTips from '../../assets/Sri-Lanka-Travel-Tips-Things-to-Do-in-Sri-Lanka-12.jpeg';

// Sample vehicle data
const vehicleData = {
  name: 'Vehicle Name',
  brand: 'Car',
  registeredDate: '2 Aug 2025',
  price: '$12/Day',
  rating: 4.5,
  reviewCount: 653,
  ac: 'yes',
  luggageCarry: 'yes',
  fuelType: 'petrol',
  seatCount: '4',
  drivingPurpose: 'Long Drive',
  driverAvailability: 'Yes',
  mapAvailability: 'Yes',
  description: `Nestled along the tranquil banks of the beautiful Batticaloa Lagoon, Name of the Restaurant invites you to indulge in an exceptional dining experience that combines culinary excellence with breathtaking natural scenery. Our commitment to the finest spot has earned us several best popular awards and established us.

At Name of the Restaurant, we pride ourselves on offering an extensive selection of Sri Lankan traditional favorites alongside popular Western cuisine. Our chefs use only the finest and most authentic flavors. Whether you crave spicy curries, fresh seafood, grilled specialties, or international classics, our menu caters to every palate and preference.

Conveniently located for travelers, Name of the Restaurant is an ideal spot for those journeying through Sri Lanka's eastern regions. Whether you're arriving from Colombo or exploring the scenic hill country, our restaurant offers a welcoming retreat where you can recharge with great food and stunning views.

We also offer services like laundry and airport shuttle upon request, making your visit hassle-free and comfortable.

Come experience the perfect blend of traditional Sri Lankan hospitality and genuine warmth, serene surroundings, and genuine flavors at Name of the Restaurant. Whether you are here for a quick lunch, leisurely dinner, or a special celebration, we promise a memorable dining experience that will keep you coming back.`,
  gallery: [
    beach2,
    beach3,
    beach4,
    beach5,
    sriLankaTourism,
    sriLankaTravelTips
  ]
};

const reviews = [
  { id: '1', name: 'Robert DJ', rating: 5.0, date: 'Thu Vehicle 16 h17', avatar: 'R' },
  { id: '2', name: 'Elisa Wirasoef', rating: 5.0, date: 'Thu Vehicle 16 h17', avatar: 'E' },
  { id: '3', name: 'Jane Cooper', rating: 4.2, date: 'Thu Vehicle 16 h17', avatar: 'J' },
  { id: '4', name: 'Kathryn Murphy', rating: 3.0, date: 'Thu Vehicle 16 h17', avatar: 'K' }
];

const faqs = [
  'What type of fuel does this vehicle use?',
  'Does our vehicle have air conditioning?',
  'What type of vehicle can I book?',
  'What are the pickup and return times?',
  'How much does it cost to rent?',
  'What type of fuel does this vehicle use?',
  'What are the pickup and return times?',
  'How much does it cost to rent?',
  'Does our vehicle have air conditioning?'
];

const VehicleDetailsPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen mt-20 lg:mt-20 mt-16 z-10">
      {/* Breadcrumb */}
      <div className="border-b border-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer">Travel Partner</span>
            <span className="mx-2 text-gray-500">{'>'}</span>
            <span className="hover:text-blue-600 cursor-pointer truncate">Specific Travel Partner</span>
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
                    <span className="text-sm text-gray-600">Brand Name</span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{vehicleData.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Car className="w-4 h-4" />
                    <span>{vehicleData.brand}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Registered date : {vehicleData.registeredDate}</p>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                {/* Mobile: Single image carousel */}
                <div className="block lg:hidden">
                  <div className="relative">
                    <img 
                      src={vehicleData.gallery[selectedImage]} 
                      alt={vehicleData.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {/* Image counter */}
                    <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                      {selectedImage + 1} / {vehicleData.gallery.length}
                    </div>
                    {/* Navigation arrows */}
                    <button 
                      onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : vehicleData.gallery.length - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"
                    >
                      ←
                    </button>
                    <button 
                      onClick={() => setSelectedImage(selectedImage < vehicleData.gallery.length - 1 ? selectedImage + 1 : 0)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"
                    >
                      →
                    </button>
                  </div>
                  {/* Thumbnail strip */}
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {vehicleData.gallery.map((image, index) => (
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
                        src={vehicleData.gallery[selectedImage]} 
                        alt={vehicleData.name}
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
                            src={vehicleData.gallery[index]} 
                            alt={`${vehicleData.name} view ${index}`}
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
                          src={vehicleData.gallery[index]} 
                          alt={`${vehicleData.name} view ${index}`}
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
            <div className="relative rounded-xl overflow-hidden mb-4 lg:mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600"></div>
              
              <div className="relative z-10 p-4 lg:p-6 text-white">
                {/* Vehicle Specifications */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AC :</span>
                    <span className="text-sm font-medium">{vehicleData.ac}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Luggage Carry :</span>
                    <span className="text-sm font-medium">{vehicleData.luggageCarry}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fuel Type :</span>
                    <span className="text-sm font-medium">{vehicleData.fuelType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Seat count :</span>
                    <span className="text-sm font-medium">{vehicleData.seatCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Driving purpose :</span>
                    <span className="text-sm font-medium">{vehicleData.drivingPurpose}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Driver Availability :</span>
                    <span className="text-sm font-medium">{vehicleData.driverAvailability}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Map Availability :</span>
                    <span className="text-sm font-medium">{vehicleData.mapAvailability}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold mb-2">{vehicleData.price}</div>
                </div>

                {/* Book Now Button */}
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4">
                  Book Now
                </button>
              </div>
            </div>

            {/* Rating Display */}
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-4 lg:p-6 mb-4">
              <div className="flex items-center justify-between text-white">
                {/* Left side - Rating score and star */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl lg:text-4xl font-bold">{vehicleData.rating}</span>
                    <Star className="w-4 lg:w-6 h-4 lg:h-6 fill-white text-white" />
                  </div>
                  <p className="text-xs lg:text-sm text-blue-100">{vehicleData.reviewCount} reviews</p>
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
              <p>{vehicleData.description}</p>
            </div>
          </div>

          {/* FAQs About Vehicle */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">FAQs About Vehicle</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-3 lg:p-4 text-left hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900 text-sm lg:text-base">{faq}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-3 lg:px-4 pb-3 lg:pb-4 text-gray-600 text-sm lg:text-base">
                      This is a sample answer for the FAQ. Detailed information would be provided here.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
