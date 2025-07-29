import { useState } from 'react';
import { Star, MapPin, ChevronDown, Calendar, Users, CreditCard, Baby, PawPrint } from 'lucide-react';

// Import images from assets
import beach2 from '../../assets/beach2.jpg';
import beach3 from '../../assets/beach3.jpg';
import beach4 from '../../assets/beach4.jpg';
import beach5 from '../../assets/beach5.jpg';
import sriLankaTourism from '../../assets/Sri-Lanka-tourism.jpg';
import sriLankaTravelTips from '../../assets/Sri-Lanka-Travel-Tips-Things-to-Do-in-Sri-Lanka-12.jpeg';

// Sample hotel data
const hotelData = {
  name: 'The Shop Name',
  location: 'Colombo',
  price: '$17.84',
  rating: 4.5,
  reviewCount: 200,
  description: `Saman Villas offers guests an intimate luxury experience along Sri Lanka's panoramic coastline on a spectacular bluff of rock in Bentota where guests see and hear the ocean all around. Saman Villas has eight villa suites with private plunge pools offering unsurpassed 270-degree views of the stunning coastline.`,
  fullDescription: `Located directly next to a 6 km stretch of sandy beach, Saman Villas offers guests an intimate luxury experience along Sri Lanka's panoramic coastline on a spectacular bluff of rock in Bentota where guests see and hear the ocean all around. The property blends modern luxury with traditional Sri Lankan hospitality.

Even experience that luxury our service and you just one step call. The combination of understated luxury, hospitality that is genuine and warm and, an intimate setting really is the perfect place for travellers and honeymooners to feel really loved and at peace. Saman Villa provides the perfect place for guests looking for a more relaxing experience of tranquility.

Experience luxury of being cocooned in nature, offering total privacy where, you may find yourself sharing your view with an occasional egret. Whether you simply choose to linger in opulent tranquility.`,
  gallery: [
    beach2,
    beach3,
    beach4,
    beach5,
    sriLankaTourism,
    sriLankaTravelTips
  ],
  facilities: ['Free WiFi', 'Bar-Cafe', 'Mini fridge', 'Swimming Pool', 'Laundry service', 'A/C', 'SPA', 'Room service'],
  checkIn: 'From 14:00',
  checkOut: 'Until 12:00',
  childPolicy: 'Children of any age are welcome.',
  cancellationPolicy: 'Cancellation and prepayment policies vary according to accommodation type. Please enter the dates of your stay and check the conditions of your required option.',
  childAndBedPolicy: 'Children 11 years and above will be charged as adults at this property.',
  cotPolicy: 'Cots and extra beds are not available at this property.',
  noAgeRestriction: 'There is no age requirement for check-in',
  pets: 'Pets are not allowed.',
  paymentMethods: 'Answer for further details'
};

const reviews = [
  { id: '1', name: 'Robert DJ', rating: 5.0, date: 'Thu Hotel 16 h17', avatar: 'R' },
  { id: '2', name: 'Elisa Wirasoef', rating: 5.0, date: 'Thu Hotel 16 h17', avatar: 'E' },
  { id: '3', name: 'Jane Cooper', rating: 4.2, date: 'Thu Hotel 16 h17', avatar: 'J' },
  { id: '4', name: 'Kathryn Murphy', rating: 3.0, date: 'Thu Hotel 16 h17', avatar: 'K' }
];

const faqs = [
  'What kind of breakfast is served at Hotel ?',
  'Does our hotel have swimming pool',
  'What type of room can I book at Hotel ?',
  'What are the check-in and check-out times at Hotel ?',
  'How much does it cost to stay at Hotel ?',
  'What kind of breakfast is served at Hotel ?',
  'What are the check-in and check-out times at Hotel ?',
  'How much does it cost to stay at Hotel ?',
  'Does our hotel have swimming pool'
];

const HotelDetailsPage = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen mt-20 z-10">
      {/* Breadcrumb */}
      <div className="border-b border-gray-500">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <span className="mx-2 text-gray-500">{'>'}</span>
            <span className="hover:text-blue-600 cursor-pointer">Specific Hotels</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header and Sidebar Container */}
        <div className="flex gap-8 mb-8">
          {/* Main Content - Left Side */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{hotelData.name}</h1>
                <p className="text-gray-700 leading-relaxed mb-6">{hotelData.description}</p>
              </div>

              {/* Image Gallery */}
              <div className="px-6 pb-6">
                {/* Top row with main image and right column */}
                <div className="flex gap-3 mb-3">
                  {/* Main large image */}
                  <div className="relative group cursor-pointer overflow-hidden rounded-lg">
                    <img 
                      src={hotelData.gallery[selectedImage]} 
                      alt={hotelData.name}
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
                          src={hotelData.gallery[index]} 
                          alt={`${hotelData.name} view ${index}`}
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
                        src={hotelData.gallery[index]} 
                        alt={`${hotelData.name} view ${index}`}
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

          {/* Right Sidebar */}
          <div className="w-80 flex flex-col">
            {/* Priority Highlights */}
            <div className="relative rounded-xl overflow-hidden mb-6">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm shadow-sm border border-black/10"></div>
              
              <div className="relative z-10 p-6 text-gray-800">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Priority Highlights</h3>
                
                {/* Location */}
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">No 32 , Galle face road, Colombo, SriLanka</span>
                  </div>
                </div>

                {/* Food Items */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Food Items</h4>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/40 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800">Asian</span>
                    <span className="px-3 py-1 bg-white/40 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800">Chinese</span>
                    <span className="px-3 py-1 bg-white/40 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800">American</span>
                  </div>
                </div>

                {/* Parking */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-sm">🅿️</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Free private Parking</span>
                </div>

                {/* Reserve Button */}
                <button className="w-full bg-blue-600/90 backdrop-blur-sm text-white py-3 rounded-lg hover:bg-blue-700/90 font-semibold transition-all shadow-lg">
                  Reserve Now
                </button>
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-80 relative">
              <div className="h-full relative rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798479282089!2d79.84396591477273!3d6.911284694997999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259670a4f2b19%3A0x9c3a5c1c3e8b8b8b!2sGalle%20Face%20Green%2C%20Colombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1642083456789!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hotel Location - Galle Face Road, Colombo"
                  className="absolute inset-0 rounded-lg"
                ></iframe>
                {/* Overlay to hide controls */}
                <div className="absolute top-2 right-2 w-16 h-16 bg-white rounded pointer-events-none z-10"></div>
                <div className="absolute bottom-0 left-0 w-full h-6 bg-white pointer-events-none z-10"></div>
                <div className="absolute bottom-6 right-2 w-20 h-8 bg-white rounded pointer-events-none z-10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Content Section */}
        <div className="max-w-7xl mx-auto px-4">
          {/* Most Popular Facilities & Reviews */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Most Popular Facilities & Reviews</h2>
            
            {/* Top section: Facilities on left, Rating on right */}
            <div className="flex gap-8 mb-8">
              {/* Left side - Facilities */}
              <div className="flex-1">
                <div className="grid grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-full border border-blue-200 justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📶</span>
                    </div>
                    <span className="text-sm font-medium text-blue-700">Free WiFi</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-full border border-gray-200 justify-center">
                    <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">❄️</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Full Air</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 rounded-full border border-orange-200 justify-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🍖</span>
                    </div>
                    <span className="text-sm font-medium text-orange-700">BBQ area</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-cyan-50 rounded-full border border-cyan-200 justify-center">
                    <div className="w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🏊</span>
                    </div>
                    <span className="text-sm font-medium text-cyan-700">Swimming Pool</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-yellow-50 rounded-full border border-yellow-200 justify-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🧺</span>
                    </div>
                    <span className="text-sm font-medium text-yellow-700">Laundry service</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-purple-50 rounded-full border border-purple-200 justify-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🏋️</span>
                    </div>
                    <span className="text-sm font-medium text-purple-700">GYM</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-pink-50 rounded-full border border-pink-200 justify-center">
                    <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">💆</span>
                    </div>
                    <span className="text-sm font-medium text-pink-700">SPA</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-full border border-green-200 justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🛎️</span>
                    </div>
                    <span className="text-sm font-medium text-green-700">Room service</span>
                  </div>
                </div>
              </div>

              {/* Right side - Rating Display */}
              <div className="w-80">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-6 flex items-center justify-between">
                  {/* Left side - Rating score and star */}
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-4xl font-bold">4.5</span>
                      <Star className="w-6 h-6 fill-white text-white" />
                    </div>
                    <p className="text-sm text-blue-100">653 reviews</p>
                  </div>
                  
                  {/* Right side - Rating bars */}
                  <div className="space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-xs text-white w-2">{rating}</span>
                        <Star className="w-3 h-3 fill-white text-white" />
                        <div className="w-20 h-1.5 bg-blue-300 rounded-full">
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

            {/* Bottom section: Individual Reviews */}
            <div className="grid grid-cols-4 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-2 border-blue-200 rounded-lg p-4 bg-white">
                  {/* Top section: Profile image left, name and rating right */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={`https://images.unsplash.com/photo-${review.id === '1' ? '1472099645785-5658abf4ff4e' : review.id === '2' ? '1494790108755-2616c01c5944' : review.id === '3' ? '1517841905240-472988babdf9' : '1438761681033-6461ffad8d80'}?w=48&h=48&fit=crop&crop=face`}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{review.name}</h4>
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
                        <span className="font-semibold text-sm text-blue-600">{review.rating}</span>
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

          {/* Detail Description */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Detail Description About Us</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              {hotelData.fullDescription.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Travellers Ask Questions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Travellers Ask Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <button 
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <span className="text-blue-500 text-sm">Ask your question</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <span className="text-gray-600">our team will quickly respond to you</span>
              </div>
              <div>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Ask Now
                </button>
              </div>
            </div>
          </div>

          {/* Hotel Rules */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Hotel Rules</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Check in</span>
                    <span className="text-gray-600">{hotelData.checkIn}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Check out</span>
                    <span className="text-gray-600">{hotelData.checkOut}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium block mb-2">Cancellation/ prepayment</span>
                  <p className="text-gray-600 text-sm">{hotelData.cancellationPolicy}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <Baby className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium block mb-2">Child policies</span>
                  <p className="text-gray-600 text-sm mb-2">{hotelData.childPolicy}</p>
                  <p className="text-gray-600 text-sm mb-2">{hotelData.childAndBedPolicy}</p>
                  <p className="text-gray-600 text-sm">To see correct prices and occupancy information, please add the number of children in your group and their ages to your search.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <Baby className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium block mb-2">Cot and extra bed policies</span>
                  <p className="text-gray-600 text-sm">{hotelData.cotPolicy}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium block mb-2">No age restriction</span>
                  <p className="text-gray-600 text-sm">{hotelData.noAgeRestriction}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <PawPrint className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium block mb-2">Pets</span>
                  <p className="text-gray-600 text-sm">{hotelData.pets}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium block mb-2">Accepted payment methods</span>
                  <p className="text-gray-600 text-sm">{hotelData.paymentMethods}</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs About Hotel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">FAQs About Hotel</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">{faq}</span>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-400 transform transition-transform ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-4 pb-4 text-gray-600 text-sm">
                      Answer to the question will be displayed here.
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

export default HotelDetailsPage;