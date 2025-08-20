import React, { useState, useEffect } from 'react';
import { vehicleBookingService } from '../../api/vehicleBookings';
import type { VehicleBooking } from '../../api/vehicleBookings';

interface PendingVehicleBookingsTableProps {
  onCountsChange?: (counts: any) => void;
}

const PendingVehicleBookingsTable: React.FC<PendingVehicleBookingsTableProps> = ({ onCountsChange }) => {
  const [bookings, setBookings] = useState<VehicleBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [selectedBooking, setSelectedBooking] = useState<VehicleBooking | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<string>('');

  // Fetch bookings based on filter
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all vehicle bookings for admin review
      const response = await vehicleBookingService.getAllBookings({
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      
      const allBookings = response.data || [];
      setBookings(allBookings);
      
      // Update counts for parent component
      if (onCountsChange) {
        const counts = {
          total: allBookings.length,
          pending: allBookings.filter((b: VehicleBooking) => b.adminStatus === 'pending').length,
          completed: allBookings.filter((b: VehicleBooking) => b.adminStatus === 'completed').length,
          approved: allBookings.filter((b: VehicleBooking) => b.status === 'approved').length,
        };
        onCountsChange(counts);
      }
      
    } catch (err: any) {
      console.error('Error fetching vehicle bookings:', err);
      setError('Failed to fetch vehicle bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle admin status change
  const handleAdminStatusChange = async (bookingId: string, newAdminStatus: 'completed') => {
    try {
      setActionLoading(bookingId);
      console.log('🔄 Admin updating booking status:', { bookingId, newAdminStatus });
      
      // Call API to update admin status
      await vehicleBookingService.updateBookingStatus(
        bookingId, 
        undefined, // don't change overall status
        null, // no cancellation reason
        newAdminStatus // update admin status
      );
      
      console.log('✅ Admin status updated successfully');
      
      // Refresh the bookings list
      await fetchBookings();
      
      // Show success message
      alert('Booking marked as completed! Vehicle owner has been notified.');
      
    } catch (error: any) {
      console.error('❌ Error updating admin status:', error);
      alert('Failed to update booking status. Please try again.');
    } finally {
      setActionLoading('');
    }
  };

  // Filter bookings based on admin status
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'pending') return booking.adminStatus === 'pending';
    if (filter === 'completed') return booking.adminStatus === 'completed';
    return true; // all
  });

  const getStatusColor = (adminStatus: string) => {
    switch (adminStatus) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading vehicle bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'pending', label: 'Pending Review' },
            { key: 'completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicle bookings</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' ? 'No vehicle bookings found.' : `No ${filter} bookings found.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates & Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.bookingId}</div>
                        <div className="text-sm text-gray-500">
                          Created: {formatDateTime(booking.createdAt)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Status: <span className="capitalize font-medium">{booking.status}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                        <div className="text-sm text-gray-600">{booking.customer.email}</div>
                        <div className="text-lg font-bold text-yellow-800 mt-1">
                          📞 {booking.customer.phone}
                        </div>
                        <div className="text-xs text-yellow-700 mt-1">
                          ☝️ Call this number to contact customer
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.vehicle.name}</div>
                        <div className="text-sm text-gray-500">{booking.vehicle.licensePlate}</div>
                        <div className="text-sm text-gray-500 capitalize">{booking.vehicle.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.booking.startDate)} - {formatDate(booking.booking.endDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Duration: {booking.booking.duration}
                        </div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          ${booking.pricing.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusColor(booking.adminStatus || 'pending')}`}>
                        {booking.adminStatus || 'pending'}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Owner: <span className="font-medium">{booking.ownerStatus || 'pending'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-y-2">
                      <div>
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>
                      </div>
                      
                      {/* Admin Action */}
                      {booking.adminStatus === 'pending' && (
                        <div>
                          <button
                            onClick={() => handleAdminStatusChange(booking._id, 'completed')}
                            disabled={actionLoading === booking._id}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {actionLoading === booking._id ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Mark as Completed
                              </>
                            )}
                          </button>
                          <div className="text-xs text-gray-500 mt-1">
                            Call vehicle owner & share customer phone
                          </div>
                        </div>
                      )}
                      
                      {booking.adminStatus === 'completed' && (
                        <div className="text-xs text-green-600 font-medium">
                          ✓ Admin review completed
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Vehicle Booking Details - {selectedBooking.bookingId}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedBooking.customer.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedBooking.customer.email}</p>
                    <div className="bg-yellow-100 p-2 rounded border">
                      <p className="text-lg font-bold text-yellow-800">
                        📞 Phone: {selectedBooking.customer.phone}
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">Use this number to contact customer</p>
                    </div>
                    <p><span className="font-medium">Address:</span> {selectedBooking.customer.address || 'Not provided'}</p>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
                    </svg>
                    Vehicle Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Vehicle:</span> {selectedBooking.vehicle.name}</p>
                    <p><span className="font-medium">License Plate:</span> {selectedBooking.vehicle.licensePlate}</p>
                    <p><span className="font-medium">Category:</span> <span className="capitalize">{selectedBooking.vehicle.category}</span></p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6l-3 6h3v4l3-6h-3z" />
                    </svg>
                    Booking Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Start Date:</span> {formatDateTime(selectedBooking.booking.startDate)}</p>
                    <p><span className="font-medium">End Date:</span> {formatDateTime(selectedBooking.booking.endDate)}</p>
                    <p><span className="font-medium">Duration:</span> {selectedBooking.booking.duration}</p>
                    <p><span className="font-medium">Pickup:</span> {selectedBooking.booking.pickupLocation}</p>
                    <p><span className="font-medium">Drop-off:</span> {selectedBooking.booking.dropoffLocation}</p>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Status & Actions
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm"><span className="font-medium">Overall Status:</span> 
                        <span className="ml-2 capitalize font-bold">{selectedBooking.status}</span>
                      </p>
                      <p className="text-sm"><span className="font-medium">Admin Status:</span> 
                        <span className={`ml-2 capitalize font-bold ${selectedBooking.adminStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {selectedBooking.adminStatus || 'pending'}
                        </span>
                      </p>
                      <p className="text-sm"><span className="font-medium">Owner Status:</span> 
                        <span className={`ml-2 capitalize font-bold ${selectedBooking.ownerStatus === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {selectedBooking.ownerStatus || 'pending'}
                        </span>
                      </p>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-900">
                      Total Amount: ${selectedBooking.pricing.totalAmount.toLocaleString()}
                    </div>
                    
                    {selectedBooking.notes && (
                      <div>
                        <p className="text-sm"><span className="font-medium">Notes:</span> {selectedBooking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedBooking.adminStatus === 'pending' && (
                <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleAdminStatusChange(selectedBooking._id, 'completed');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingVehicleBookingsTable;
