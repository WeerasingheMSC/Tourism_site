import { useState, useEffect } from 'react';
import { message } from 'antd';
//const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface VehicleBooking {
  _id: string;
  bookingId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    driverLicense?: string;
    idNumber?: string;
  };
  vehicle: {
    vehicleId: string;
    name: string;
    licensePlate: string;
    category: string;
  };
  booking: {
    startDate: Date | string;
    endDate: Date | string;
    duration: string | number;
    pickupLocation: string;
    dropoffLocation: string;
    pickupTime?: string;
    dropoffTime?: string;
    withDriver?: boolean;
    driverRequired?: boolean;
  };
  pricing: {
    basePrice: number;
    dailyRate?: number;
    totalDays?: number;
    subtotal?: number;
    driverCharge?: number;
    insurance?: number;
    tax?: number;
    discount?: number;
    totalAmount: number;
    rentalType?: string;
    unit?: string;
    estimatedHours?: number;
    estimatedKilometers?: number;
  };
  payment: {
    method: 'cash' | 'card' | 'bank_transfer' | 'online';
    status: 'pending' | 'partial' | 'paid' | 'refunded';
    advanceAmount?: number;
    remainingAmount?: number;
    transactionId?: string;
  };
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'approved';
  adminStatus: 'pending' | 'completed';
  ownerStatus: 'pending' | 'confirmed';
  notes?: string;
  rating?: number;
  review?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API functions for vehicle booking management
const vehicleBookingAPI = {
  getOwnerBookings: async (): Promise<VehicleBooking[]> => {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/api/vehicle-bookings/my-bookings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch owner vehicle bookings');
    }
    
    const result = await response.json();
    return result.data || result;
  },

  updateBookingStatus: async (bookingId: string, status?: "pending" | "confirmed" | "active" | "completed" | "cancelled", adminStatus?: "pending" | "completed", ownerStatus?: "pending" | "confirmed", cancellationReason?: string) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const requestBody: any = {};
    if (status) requestBody.status = status;
    if (adminStatus) requestBody.adminStatus = adminStatus;
    if (ownerStatus) requestBody.ownerStatus = ownerStatus;
    if (cancellationReason) requestBody.cancellationReason = cancellationReason;

    const response = await fetch(`${API_BASE_URL}/api/vehicle-bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to update booking status`);
    }
    
    const result = await response.json();
    return result;
  },
};

const Bookings = () => {
  const [bookings, setBookings] = useState<VehicleBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch owner bookings from API
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await vehicleBookingAPI.getOwnerBookings();
      
      // Debug: Log the booking data to see the actual structure
      console.log('🔍 DEBUG - Vehicle Bookings Data:', data);
      data.forEach((booking, index) => {
        console.log(`🔍 Booking ${index + 1} pricing:`, booking.pricing);
        console.log(`🔍 Booking ${index + 1} rentalType:`, booking.pricing?.rentalType);
        console.log(`🔍 Booking ${index + 1} unit:`, booking.pricing?.unit);
        console.log('---');
      });
      
      setBookings(data);
    } catch (err: any) {
      console.error('Failed to fetch owner bookings:', err);
      setError(err.message);
      message.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle owner status change
  const handleOwnerStatusChange = async (bookingId: string, newOwnerStatus: 'pending' | 'confirmed') => {
    try {
      console.log('🔄 OwnerBookings - Owner status change:', { bookingId, newOwnerStatus });
      
      // Call API to update owner status
      const result = await vehicleBookingAPI.updateBookingStatus(bookingId, undefined, undefined, newOwnerStatus);
      console.log('✅ OwnerBookings - Owner status change API response:', result);
      
      // Update the booking in local state
      setBookings((prev) => 
        prev.map((booking) => 
          booking._id === bookingId 
            ? { 
                ...booking, 
                ownerStatus: newOwnerStatus,
                updatedAt: new Date()
              }
            : booking
        )
      );
      
      message.success(`Owner status updated to ${newOwnerStatus}`);
      
      // Refresh data to ensure consistency
      setTimeout(() => {
        fetchBookings();
      }, 1000);
    } catch (err: any) {
      console.error("❌ OwnerBookings - Owner status change failed:", err);
      message.error('Failed to update owner status');
      fetchBookings();
    }
  };

  // Format date function
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter bookings based on active tab and search term
  const filteredBookings = bookings.filter((booking) => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'pending' && booking.adminStatus === 'completed' && booking.ownerStatus === 'pending') ||
      (activeTab === 'confirmed' && booking.ownerStatus === 'confirmed') ||
      (activeTab === 'completed' && booking.status === 'completed') ||
      (activeTab === 'cancelled' && booking.status === 'cancelled');
    
    const matchesSearch = booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const getTabCount = (tab: string) => {
    if (tab === 'all') return bookings.length;
    if (tab === 'pending') return bookings.filter(b => b.adminStatus === 'completed' && b.ownerStatus === 'pending').length;
    if (tab === 'confirmed') return bookings.filter(b => b.ownerStatus === 'confirmed').length;
    if (tab === 'completed') return bookings.filter(b => b.status === 'completed').length;
    if (tab === 'cancelled') return bookings.filter(b => b.status === 'cancelled').length;
    return 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'approved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500">Error: {error}</div>
        <button 
          onClick={fetchBookings}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Vehicle Bookings</h1>
          <p className="text-gray-600">Manage bookings for your vehicles</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All Bookings' },
              { key: 'pending', label: 'Pending Review' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({getTabCount(tab.key)})
              </button>
            ))}
          </nav>
        </div>

        {/* Bookings List */}
        <div className="overflow-x-auto">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rental Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 font-mono">{booking.bookingId}</div>
                        <div className="text-sm text-gray-500">{formatDate(booking.createdAt)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                        <div className="text-sm text-gray-500">{booking.customer.email}</div>
                        <div className="text-sm text-blue-600 font-mono">{booking.customer.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.vehicle.name}</div>
                        <div className="text-sm text-gray-500">{booking.vehicle.licensePlate}</div>
                        <div className="text-sm text-gray-500">{booking.vehicle.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Rental Type and Quantity Display */}
                      <div className="text-xs font-medium">
                        {/* Enhanced logic to handle missing rental type data */}
                        {(() => {
                          const rentalType = (booking.pricing as any).rentalType;
                          const unit = booking.pricing.unit;
                          const hasHours = booking.pricing.estimatedHours || (booking.pricing as any).totalHours;
                          const hasKilometers = booking.pricing.estimatedKilometers || (booking.pricing as any).totalKilometers || (booking.pricing as any).distance;
                          
                          // Debug logging for each booking
                          console.log('Booking analysis:', {
                            rentalType,
                            unit,
                            hasHours,
                            hasKilometers,
                            fullPricing: booking.pricing
                          });

                          // Check for hourly rentals (explicit or inferred)
                          if (rentalType === 'hourly' || rentalType === 'hour' || unit === 'hour' || unit === 'hours' || hasHours) {
                            return (
                              <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                                <span className="text-blue-800 font-bold">⏱️ HOURLY</span>
                                <div className="text-blue-700 mt-1 font-semibold">
                                  {hasHours ? `${hasHours} hours` : 'Hours not specified'}
                                </div>
                              </div>
                            );
                          }

                          // Check for per kilometer rentals (explicit or inferred)
                          if (rentalType === 'kilometer' || rentalType === 'per-kilometer' || rentalType === 'km' || 
                              unit === 'km' || unit === 'kilometer' || hasKilometers) {
                            return (
                              <div className="bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                <span className="text-green-800 font-bold">📏 PER KM</span>
                                <div className="text-green-700 mt-1 font-semibold">
                                  {hasKilometers ? `${hasKilometers} km` : 'Distance not specified'}
                                </div>
                              </div>
                            );
                          }

                          // Check for daily rentals (explicit or default)
                          if (rentalType === 'daily' || rentalType === 'day' || unit === 'day' || unit === 'daily' || !rentalType) {
                            return (
                              <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                <span className="text-gray-700 font-bold">📅 DAILY</span>
                                {!rentalType && (
                                  <div className="text-gray-600 mt-1 text-xs">(default - no type specified)</div>
                                )}
                              </div>
                            );
                          }

                          // Fallback - show debug info for unknown types
                          return (
                            <div className="bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                              <span className="text-yellow-700 font-bold">🔍 UNKNOWN TYPE</span>
                              <div className="text-yellow-600 mt-1 text-xs">
                                <div><strong>Type:</strong> "{rentalType || 'not set'}"</div>
                                <div><strong>Unit:</strong> "{unit || 'not set'}"</div>
                                {booking.pricing.estimatedHours && <div><strong>Hours:</strong> {booking.pricing.estimatedHours}</div>}
                                {booking.pricing.estimatedKilometers && <div><strong>KM:</strong> {booking.pricing.estimatedKilometers}</div>}
                                <div className="text-yellow-500 mt-1 text-xs italic">
                                  💡 This booking needs rental type migration
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{formatDate(booking.booking.startDate)}</div>
                        <div className="text-sm text-gray-500">to {formatDate(booking.booking.endDate)}</div>
                        <div className="text-sm text-gray-500">({booking.booking.duration} days)</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">From: {booking.booking.pickupLocation}</div>
                        <div className="text-sm text-gray-500">To: {booking.booking.dropoffLocation}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600"> {booking.pricing.totalAmount.toLocaleString()}$</div>
                      <div className="text-sm text-gray-500">
                        {booking.pricing.rentalType && booking.pricing.basePrice ? (
                          <span>{booking.pricing.basePrice}$/{booking.pricing.unit || 'day'}$</span>
                        ) : (
                          <span>{booking.pricing.basePrice}$/day</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{booking.payment.method}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                        
                        {/* Admin Status Display */}
                        <div className="text-xs text-gray-500">
                          Admin: <span className={`font-medium ${booking.adminStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {booking.adminStatus === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                        
                        {/* Owner Status Dropdown */}
                        {booking.adminStatus === 'completed' && (
                          <div className="text-xs">
                            <label className="block text-gray-500 mb-1">Owner Status:</label>
                            <select
                              value={booking.ownerStatus || 'pending'}
                              onChange={(e) => handleOwnerStatusChange(booking._id, e.target.value as 'pending' | 'confirmed')}
                              className={`w-full px-2 py-1 text-xs rounded border focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                booking.ownerStatus === 'confirmed' 
                                  ? 'bg-green-50 border-green-300 text-green-700' 
                                  : 'bg-yellow-50 border-yellow-300 text-yellow-700'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <button className="text-blue-600 hover:text-blue-900">View Details</button>
                        <button className="text-green-600 hover:text-green-900">Contact Customer</button>
                        {booking.ownerStatus === 'pending' && booking.adminStatus === 'completed' && (
                          <button 
                            onClick={() => handleOwnerStatusChange(booking._id, 'confirmed')}
                            className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded text-xs"
                          >
                            Confirm Booking
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900"> {bookings.reduce((sum, booking) => sum + booking.pricing.totalAmount, 0).toLocaleString()}$</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{getTabCount('pending')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{getTabCount('confirmed')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
