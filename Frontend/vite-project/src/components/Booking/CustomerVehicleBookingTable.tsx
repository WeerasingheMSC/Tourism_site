import React, { useState, useEffect } from "react";
import { vehicleBookingService } from "../../api/vehicleBookings";
import type { VehicleBooking } from "../../api/vehicleBookings";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

// Badge colors for statuses
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "confirmed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "active":
      return "bg-green-100 text-green-700 border-green-200";
    case "completed":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    case "approved":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const CustomerVehicleBookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<VehicleBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "active" | "completed" | "cancelled" | "approved">("all");
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await vehicleBookingService.getCustomerBookings({
        status: undefined, // Always fetch all bookings, filter on frontend
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      
      console.log('🔍 Customer Vehicle Bookings - Response:', response.data || []);
      console.log('🔍 Customer Vehicle Bookings - First booking statuses:', response.data?.[0] ? {
        status: response.data[0].status,
        adminStatus: response.data[0].adminStatus,
        ownerStatus: response.data[0].ownerStatus
      } : 'No bookings');
      
      setBookings(response.data || []);
    } catch (err: any) {
      console.error('Error fetching customer vehicle bookings:', err);
      setError(err?.message || 'Failed to fetch your vehicle bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await vehicleBookingService.updateBookingStatus(
        bookingId,
        'cancelled',
        'Cancelled by customer'
      );
      
      message.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      message.error(error?.message || 'Failed to cancel booking');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []); // Only fetch once on mount, not on filter change

  if (loading) return <div className="my-8 text-center">Loading your vehicle bookings…</div>;
  if (error) return <div className="my-8 text-center text-red-500">Error: {error}</div>;

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(booking => {
    // Special handling for "approved" filter - only show fully approved bookings
    if (filter === 'approved') {
      return (booking.status === 'approved' || booking.status === 'confirmed') && booking.ownerStatus === 'confirmed';
    }
    // For other filters, match the main status
    return booking.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Booking Summary for Tracking */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Booking Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {bookings.filter(b => b.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => (b.status === 'approved' || b.status === 'confirmed') && b.ownerStatus === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-500">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {bookings.filter(b => b.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {bookings.length}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Track Your Vehicle Bookings</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
          {[
            { key: 'all', label: 'All Bookings', count: bookings.length },
            { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
            { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
            { key: 'active', label: 'Active', count: bookings.filter(b => b.status === 'active').length },
            { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
            { key: 'approved', label: 'Approved', count: bookings.filter(b => (b.status === 'approved' || b.status === 'confirmed') && b.ownerStatus === 'confirmed').length },
            { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
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
              {tab.label} ({tab.count})
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
              {filter === 'all' ? 'You haven\'t made any vehicle bookings yet.' : `No ${filter} bookings found.`}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/vehicles")}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Book a Vehicle
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking
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
                      <div className="text-sm font-medium text-gray-900">{booking.bookingId}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.vehicle.name}</div>
                          <div className="text-sm text-gray-500">{booking.vehicle.licensePlate}</div>
                          <div className="text-sm text-gray-500 capitalize">{booking.vehicle.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(booking.booking.startDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {new Date(booking.booking.endDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">({booking.booking.duration})</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">From: {booking.booking.pickupLocation}</div>
                        <div className="text-sm text-gray-500">To: {booking.booking.dropoffLocation}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${booking.pricing.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.payment.status === 'paid' ? '✓ Paid' : 'Pending payment'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        // Determine display status based on admin and owner status
                        // Customer sees "approved" only when admin selected approved/confirmed AND owner confirmed
                        const isAdminApproved = booking.status === 'approved' || booking.status === 'confirmed';
                        const isOwnerConfirmed = booking.ownerStatus === 'confirmed';
                        const displayStatus = (isAdminApproved && isOwnerConfirmed) 
                          ? 'approved' 
                          : booking.status; // Show actual status instead of always 'pending'
                        
                        console.log('🔍 Customer Status Display:', {
                          bookingId: booking.bookingId,
                          adminStatus: booking.status,
                          ownerStatus: booking.ownerStatus,
                          isAdminApproved,
                          isOwnerConfirmed,
                          displayStatus
                        });
                        
                        return (
                          <>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusColor(displayStatus)}`}>
                              {displayStatus}
                            </span>
                            {displayStatus === 'approved' && (
                              <div className="mt-1">
                                <span className="text-xs text-green-600 font-medium">✓ Ready for your trip!</span>
                              </div>
                            )}
                            {displayStatus === 'pending' && (isAdminApproved || isOwnerConfirmed) && (
                              <div className="mt-1">
                                <span className="text-xs text-blue-600 font-medium">
                                  {isAdminApproved && !isOwnerConfirmed ? '⏳ Waiting for owner confirmation' : 
                                   !isAdminApproved && isOwnerConfirmed ? '⏳ Waiting for admin approval' : 
                                   '⏳ Under review'}
                                </span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        // Tracking information showing approval progress
                        const adminApproved = booking.status === 'approved' || booking.status === 'confirmed';
                        const ownerConfirmed = booking.ownerStatus === 'confirmed';
                        
                        return (
                          <div className="text-xs space-y-1">
                            <div className={`flex items-center ${adminApproved ? 'text-green-600' : 'text-gray-400'}`}>
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${adminApproved ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              Admin: {adminApproved ? 'Approved' : 'Pending'}
                            </div>
                            <div className={`flex items-center ${ownerConfirmed ? 'text-green-600' : 'text-gray-400'}`}>
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${ownerConfirmed ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              Owner: {ownerConfirmed ? 'Confirmed' : 'Pending'}
                            </div>
                            {booking.status === 'cancelled' && (
                              <div className="flex items-center text-red-600">
                                <span className="inline-block w-2 h-2 rounded-full mr-2 bg-red-500"></span>
                                Cancelled
                                {booking.cancellationReason && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Reason: {booking.cancellationReason}
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="text-gray-500 mt-1">
                              Updated: {new Date(booking.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/vehicle-booking/${booking._id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                        {(() => {
                          // Determine display status for action logic
                          const displayStatus = ((booking.status === 'approved' || booking.status === 'confirmed') && booking.ownerStatus === 'confirmed') 
                            ? 'approved' 
                            : booking.status; // Show actual status instead of always 'pending'
                          
                          return displayStatus === 'pending' && (
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Cancel
                            </button>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>

      {/* Summary at the bottom */}
      {filteredBookings.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
            {filter !== 'all' ? ` with status: ${filter}` : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerVehicleBookingTable;
