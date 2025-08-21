import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleBookingService } from '../../api/vehicleBookings';
import type { VehicleBooking } from '../../api/vehicleBookings';
import { isAuthenticated } from '../../utils/authHelper';
import { message } from 'antd';
//const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const VehicleBookingDetailsPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<VehicleBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Load booking details
    if (bookingId) {
      loadBookingDetails(bookingId);
    } else {
      setError('No booking ID provided');
      setLoading(false);
    }
  }, [bookingId, navigate]);

  const loadBookingDetails = async (id: string) => {
    try {
      setLoading(true);
      const response = await vehicleBookingService.getBookingById(id);
      setBooking(response.data);
      setError(null);
    } catch (error: any) {
      console.error('Error loading booking details:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerConfirmBooking = async () => {
    if (!booking) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/vehicle-bookings/${booking._id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ownerStatus: 'confirmed' }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm booking');
      }

      // Update local state
      setBooking(prev => prev ? { ...prev, ownerStatus: 'confirmed' as any } : null);
      message.success('Booking confirmed successfully! Customer will be notified.');
    } catch (error: any) {
      console.error('Error confirming booking:', error);
      message.error('Failed to confirm booking');
    }
  };

  const formatDateTime = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Booking</h2>
          <p className="text-lg text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/vehicle-owner-dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/vehicle-owner-dashboard')}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Dashboard
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
                  <p className="text-sm text-gray-600">ID: {booking.bookingId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {/* Status Badges */}
                <div className="flex flex-col space-y-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'active' ? 'bg-green-100 text-green-800' :
                    booking.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                    booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Overall: {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                  </span>
                  
                  <div className="flex space-x-2 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      (booking as any).adminStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Admin: {(booking as any).adminStatus || 'pending'}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      (booking as any).ownerStatus === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Owner: {(booking as any).ownerStatus || 'pending'}
                    </span>
                  </div>
                </div>
                
                {/* Owner Action Button */}
                {(booking as any).ownerStatus === 'pending' && (booking as any).adminStatus === 'completed' && (
                  <button
                    onClick={handleOwnerConfirmBooking}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Confirm Booking
                  </button>
                )}
                
                {(booking as any).ownerStatus === 'confirmed' && (
                  <div className="text-center">
                    <div className="text-green-600 font-medium">✅ Confirmed</div>
                    <div className="text-xs text-gray-500">Ready for trip</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Overview Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold">Trip Overview</h2>
                <p className="text-blue-100 mt-1">Booking created on {formatDate(booking.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">${booking.pricing.totalAmount}</p>
                <p className="text-blue-100">Total Amount</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Route Information */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Pickup Location</h3>
                    <p className="text-gray-700 text-lg">{booking.booking.pickupLocation}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDateTime(booking.booking.startDate)}</p>
                    {booking.booking.pickupTime && (
                      <p className="text-sm text-gray-500">Scheduled time: {booking.booking.pickupTime}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="h-px bg-gray-300 flex-grow"></div>
                  <div className="mx-4 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div className="h-px bg-gray-300 flex-grow"></div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop-off Location</h3>
                    <p className="text-gray-700 text-lg">{booking.booking.dropoffLocation}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDateTime(booking.booking.endDate)}</p>
                    {booking.booking.dropoffTime && (
                      <p className="text-sm text-gray-500">Scheduled time: {booking.booking.dropoffTime}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-900">{booking.booking.duration}</div>
                    <div className="text-sm text-gray-600">Duration (days)</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-900">{booking.booking.driverRequired ? 'Yes' : 'No'}</div>
                    <div className="text-sm text-gray-600">Driver Required</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle</span>
                      <span className="font-medium text-gray-900">{booking.vehicle.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">License Plate</span>
                      <span className="font-medium text-gray-900">{booking.vehicle.licensePlate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium text-gray-900 capitalize">{booking.vehicle.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900">Customer Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Customer Name</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{booking.customer.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</label>
                <p className="mt-1 text-gray-700">{booking.customer.address || 'Not provided'}</p>
              </div>
              {booking.customer.driverLicense && (
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Driver License</label>
                  <p className="mt-1 text-gray-700">{booking.customer.driverLicense}</p>
                </div>
              )}
              {booking.customer.idNumber && (
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">ID Number</label>
                  <p className="mt-1 text-gray-700">{booking.customer.idNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900">Pricing Breakdown</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium">${booking.pricing.basePrice}</span>
              </div>
              {booking.pricing.driverCharge && booking.pricing.driverCharge > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver Charge</span>
                  <span className="font-medium">${booking.pricing.driverCharge}</span>
                </div>
              )}
              {booking.pricing.insurance && booking.pricing.insurance > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Insurance</span>
                  <span className="font-medium">${booking.pricing.insurance}</span>
                </div>
              )}
              {booking.pricing.discount && booking.pricing.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">-${booking.pricing.discount}</span>
                </div>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">${booking.pricing.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="ml-4 text-xl font-bold text-gray-900">Payment Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Payment Method</label>
                <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">{booking.payment.method}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Payment Status</label>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    booking.payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                    booking.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.payment.status.toUpperCase()}
                  </span>
                </div>
              </div>
              {booking.payment.advanceAmount && (
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Advance Amount</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">${booking.payment.advanceAmount}</p>
                </div>
              )}
              {booking.payment.remainingAmount && (
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Remaining Amount</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">${booking.payment.remainingAmount}</p>
                </div>
              )}
              {booking.payment.transactionId && (
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Transaction ID</label>
                  <p className="mt-1 text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">{booking.payment.transactionId}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(booking.notes || booking.cancellationReason) && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h3>
            <div className="space-y-4">
              {booking.notes && (
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">Notes</h4>
                  <p className="text-blue-800">{booking.notes}</p>
                </div>
              )}
              {booking.cancellationReason && (
                <div className="bg-red-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-red-900 mb-2">Cancellation Reason</h4>
                  <p className="text-red-800">{booking.cancellationReason}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Timeline</h3>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Created</p>
              <p className="text-sm text-gray-500">{formatDateTime(booking.createdAt)}</p>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className="text-center flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                booking.status !== 'pending' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Current Status</p>
              <p className="text-sm text-gray-500">{booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}</p>
            </div>
            <div className="flex-1 h-px bg-gray-200"></div>
            <div className="text-center flex-1">
              <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Last Updated</p>
              <p className="text-sm text-gray-500">{formatDateTime(booking.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleBookingDetailsPage;
