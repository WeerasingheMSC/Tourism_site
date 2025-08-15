import routeIcon from '../../assets/icons/route icon.png';

interface BookingPartnerProps {
  onTabChange?: (tab: 'profile' | 'hotel' | 'booking') => void;
  activeTab?: 'profile' | 'hotel' | 'booking';
}

const BookingPartner: React.FC<BookingPartnerProps> = ({ onTabChange, activeTab = 'booking' }) => {
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

        {/* Travel Partner Content */}
        <div className="flex items-center justify-between">
          {/* Left Content */}
          <div className="flex-1 pr-12">
            <h1 className="text-6xl font-bold text-black mb-6">
              Become Our Travel Partner
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
              Vorem ipsum dolor sit amet, consectetur adipiscing elit.Vorem ipsum dolor sit amet, 
              consectetur adipiscing elit.Vorem ipsum dolor sit amet, consectetur ........................
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
              Become a Travel partner
            </button>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 flex justify-center items-center">
            <img 
              src={routeIcon} 
              alt="Travel Route" 
              className="w-80 h-80 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPartner;
