import buildingIcon from '../../assets/icons/building icon.png';

interface HotelPartnerProps {
  onTabChange?: (tab: 'profile' | 'hotel' | 'booking') => void;
  activeTab?: 'profile' | 'hotel' | 'booking';
}

const HotelPartner: React.FC<HotelPartnerProps> = ({ onTabChange, activeTab = 'hotel' }) => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-12">
          <button 
            onClick={() => onTabChange?.('profile')}
            className={`pb-3 px-1 text-sm font-medium ${
              activeTab === 'profile' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
          <button 
            onClick={() => onTabChange?.('hotel')}
            className={`pb-3 px-1 text-sm font-medium ${
              activeTab === 'hotel' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hotel partner
          </button>
          <button 
            onClick={() => onTabChange?.('booking')}
            className={`pb-3 px-1 text-sm font-medium ${
              activeTab === 'booking' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Booking partner
          </button>
        </div>

        {/* Hotel Partner Content */}
        <div className="flex items-center justify-between">
          {/* Left Content */}
          <div className="flex-1 pr-12">
            <h1 className="text-6xl font-bold text-black mb-6">
              Become Our Hotel Partner
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
              Vorem ipsum dolor sit amet, consectetur adipiscing elit.Vorem ipsum dolor sit amet, 
              consectetur adipiscing elit.Vorem ipsum dolor sit amet, consectetur ........................
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
              Become a Hotel partner
            </button>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              {/* Hotel Building with Stars */}
              <div className="flex flex-col items-center">
                {/* Stars around hotel */}
                <div className="relative mb-4">
                  {/* Top stars */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <svg className="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </div>
                  {/* Side stars */}
                  <div className="absolute -left-12 top-4">
                    <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </div>
                  <div className="absolute -right-12 top-4">
                    <svg className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </div>
                  <div className="absolute -left-8 -top-2">
                    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </div>
                  <div className="absolute -right-8 -top-2">
                    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  </div>
                </div>

                {/* Hotel Building Icon */}
                <div className="relative">
                  <img 
                    src={buildingIcon} 
                    alt="Hotel Building" 
                    className="w-48 h-48 object-contain"
                  />
                </div>

                {/* Cloud elements */}
                <div className="absolute -left-16 top-16">
                  <div className="bg-blue-300 w-12 h-8 rounded-full opacity-60"></div>
                </div>
                <div className="absolute -right-16 top-16">
                  <div className="bg-blue-300 w-12 h-8 rounded-full opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPartner;
