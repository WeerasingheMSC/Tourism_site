import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ContactDisplay from '../ContactDisplay/ContactDisplay';
import HotelPartner from './HotelPartner';
import BookingPartner from './BookingPartner';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'profile' | 'hotel' | 'booking'>('profile');
  
  console.log('Profile ID:', id);

  // Profile tab content
  const ProfileContent = () => (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-1 text-sm font-medium ${
              activeTab === 'profile' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('hotel')}
            className={`pb-3 px-1 text-sm font-medium ${
              activeTab === 'hotel' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hotel partner
          </button>
          <button 
            onClick={() => setActiveTab('booking')}
            className={`pb-3 px-1 text-sm font-medium ${
              activeTab === 'booking' 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Booking partner
          </button>
        </div>

        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Robert DJ</h1>
          <p className="text-lg text-gray-600">United States Of America</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Visit Count */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Count</h3>
            <div className="text-5xl font-bold text-gray-900">2</div>
          </div>

          {/* Feed Back */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feed Back</h3>
            <p className="text-gray-600 leading-relaxed">
              Vorem ipsum dolor sit amet, consectetur adipiscing elit.Vorem ipsum dolor sit amet, 
              consectetur adipiscing elit.Vorem ipsum dolor sit amet, consectetur ........................
            </p>
          </div>
        </div>

        {/* Partner Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContactDisplay type="hotel" />
          <ContactDisplay type="vehicle" />
        </div>
      </div>
    </div>
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'hotel':
        return <HotelPartner onTabChange={setActiveTab} activeTab={activeTab} />;
      case 'booking':
        return <BookingPartner onTabChange={setActiveTab} activeTab={activeTab} />;
      default:
        return <ProfileContent />;
    }
  };

  return renderContent();
};

export default ProfilePage;