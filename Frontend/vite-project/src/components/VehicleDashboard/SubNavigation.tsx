import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SubNavigationProps {
  type: 'hotel' | 'vehicle';
}

const SubNavigation: React.FC<SubNavigationProps> = ({ }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    navigate('/profile/123');
  };

  const handleHotelPartnerClick = () => {
    navigate('/hotel-partner-dashboard');
  };

  const handleTravelPartnerClick = () => {
    navigate('/vehicle-partner-dashboard');
  };

  

  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('profile')) return 'profile';
    if (path.includes('hotel-partner-dashboard')) return 'hotel-partner';
    if (path.includes('vehicle-partner-dashboard')) return 'vehicle-partner';
    if (path.includes('bookings')) return 'bookings';
    return '';
  };

  const activeTab = getActiveTab();

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <nav className="flex space-x-8">
            <button 
              onClick={handleProfileClick}
              className={`py-2 font-medium transition-colors ${
                activeTab === 'profile' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Profile
            </button>
            <button
              onClick={handleHotelPartnerClick}
              className={`py-2 font-medium transition-colors ${
                activeTab === 'hotel-partner' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Hotel Partner
            </button>
            <button
              onClick={handleTravelPartnerClick}
              className={`py-2 font-medium transition-colors ${
                activeTab === 'vehicle-partner' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Travel Partner
            </button>
          </nav>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors">
              Edit
            </button>
            <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubNavigation;
