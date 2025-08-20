import React, { useState } from 'react';
import { ExternalLink, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import SubNavigation from './SubNavigation';
import HotelDetailsPage from '../Hotels/HotelDetailsPage';
import VehicleDetailsPage from '../Vehicles/VehicleDetailsPage';

interface PartnerDashboardProps {
  type: 'hotel' | 'vehicle';
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ type }) => {
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleBackToDashboard = () => {
    if (type === 'hotel') {
      navigate('/hotel-dash');
    } else {
      navigate('/transport-dash');
    }
  };

  const handleActionClick = () => {
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
  };

  // Sample data for the reservation table
  const reservations = [
    {
      id: 'VR2023',
      name: 'Dinush',
      country: 'USA',
      contactNo: '+94 0 704896248',
      bookingDate: 'Rs 100 @ gmail.com',
      reservationType: 'per day',
      date: '04 / 06 / 2023',
      numberOfDaysHours: '2',
    },
    // Add more sample data rows
    ...Array(9).fill(null).map((_, index) => ({
      id: `VR${2024 + index}`,
      name: 'Sample',
      country: 'Sri Lanka',
      contactNo: '+94 0 123456789',
      bookingDate: 'sample@example.com',
      reservationType: 'per hour',
      date: '05 / 06 / 2023',
      numberOfDaysHours: '1',
    }))
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Sub Navigation */}
      <SubNavigation type={type} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToDashboard}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Bookings Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-blue-600 mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-gray-900">23</p>
          </div>

          {/* Active Bookings Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-blue-600 mb-2">Active Bookings</h3>
            <p className="text-3xl font-bold text-gray-900">6</p>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">Rs: 18,954.87</p>
          </div>

          {/* Visited Count Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium mb-2">Visited count</h3>
            <p className="text-3xl font-bold">54</p>
          </div>
        </div>

        {/* Active Reservation Details */}
        <div className='pb-6'>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Reservation Details</h2>
          </div>
          
          <div className="overflow-x-auto rounded-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservation No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservation Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No of days / hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.contactNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.bookingDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.reservationType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.numberOfDaysHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button 
                        onClick={handleActionClick}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal rendered using portal */}
      {showDetailsModal && createPortal(
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-7xl mx-4 my-8 bg-white rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Modal content */}
            <div className="max-h-[90vh] overflow-y-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {type === 'hotel' ? (
                <HotelDetailsPage />
              ) : (
                <VehicleDetailsPage />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PartnerDashboard;
