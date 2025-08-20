import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message, Popconfirm, Switch } from 'antd';
import { vehicleService, vehicleBookingService } from '../../api/vehicleBookings';
import type { Vehicle, VehicleBooking } from '../../api/vehicleBookings';
import { getCurrentVehicleOwner, isAuthenticated } from '../../utils/authHelper';
import { vehicleOwnerService } from '../../api/vehicleOwner';

const VehicleOwner: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<VehicleBooking[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorVehicles, setErrorVehicles] = useState<string | null>(null);
  const [errorBookings, setErrorBookings] = useState<string | null>(null);
  const [currentOwner, setCurrentOwner] = useState<any>(null);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    activeBookings: 0,
    totalRevenue: 0,
    completedBookings: 0
  });

  useEffect(() => {
    // Check authentication - but don't force anything
    if (!isAuthenticated()) {
      console.log('❌ VehicleOwner - Not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    // Load current owner info from JWT token
    const owner = getCurrentVehicleOwner();
    console.log('🔍 VehicleOwner Debug - Current owner from JWT:', owner);
    console.log('🔍 VehicleOwner Debug - Token from localStorage:', localStorage.getItem('authToken'));
    
    if (owner && (owner.userId || owner.id)) {
      setCurrentOwner(owner);
      checkOwnerProfile();
    } else {
      console.log('❌ VehicleOwner Debug - No valid owner ID found. Owner data:', owner);
      console.log('❌ VehicleOwner Debug - Available fields:', owner ? Object.keys(owner) : 'none');
      // Don't force redirect if user has valid token but different structure
      if (owner && owner.email) {
        console.log('✅ VehicleOwner Debug - User has valid token with email, proceeding...');
        setCurrentOwner(owner);
        checkOwnerProfile();
      } else {
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleViewBookingDetails = (booking: VehicleBooking) => {
    navigate(`/vehicle-booking-details/${booking._id}`);
  };

  const handleOwnerStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      let updateData: any = {};
      
      if (newStatus === 'approved') {
        updateData.ownerStatus = 'confirmed';
        // Don't automatically set main status - let backend decide based on both admin and owner status
      } else if (newStatus === 'cancel') {
        updateData.status = 'cancelled';
        updateData.ownerStatus = 'pending';
      } else {
        updateData.ownerStatus = 'pending';
      }

      const response = await vehicleBookingService.updateBookingStatus(
        bookingId, 
        updateData.status, 
        newStatus === 'cancel' ? 'Cancelled by owner' : null,
        undefined, // adminStatus
        updateData.ownerStatus
      );

      // Update local state with the response data from backend
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, ...response.data }
            : booking
        )
      );

      message.success(`Booking status updated to ${newStatus === 'approved' ? 'approved' : newStatus === 'cancel' ? 'cancelled' : 'pending'}`);
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      message.error(error?.message || 'Failed to update booking status');
    }
  };

  const checkOwnerProfile = async () => {
    try {
      const profileCheck = await vehicleOwnerService.checkProfileExists();
      
      if (!profileCheck.profileExists) {
        // Profile doesn't exist, redirect to details form
        console.log('🔍 VehicleOwner - No profile found, redirecting to details form');
        message.info('Please complete your vehicle owner profile to access the dashboard.');
        navigate('/vehicle-owner-details');
        return;
      }

      // Profile exists, load dashboard data
      loadVehicles();
      loadBookings();
      loadStatistics();
    } catch (error: any) {
      console.error('❌ Error checking owner profile:', error);
      // If there's an error checking profile, still allow access but show message
      message.warning('Unable to verify profile status. Please complete your profile if needed.');
      loadVehicles();
      loadBookings();
      loadStatistics();
    }
  };

  const loadVehicles = async () => {
    try {
      setLoadingVehicles(true);
      console.log('🚗 VehicleOwner Debug - Loading vehicles for current owner...');
      
      // Use getMyVehicles to get only owner's vehicles
      const response = await vehicleService.getMyVehicles();
      console.log('🚗 VehicleOwner Debug - API response:', response);
      
      // Now only shows vehicles owned by current user
      setVehicles(response.data || []);
      setErrorVehicles(null);
    } catch (error: any) {
      console.error('❌ VehicleOwner Debug - Error loading vehicles:', error);
      if (error?.message?.includes('403') || error?.message?.includes('Access denied')) {
        setErrorVehicles('Access denied. Please ensure you are logged in as a vehicle owner.');
      } else {
        setErrorVehicles(error?.message || 'Failed to load vehicles');
      }
    } finally {
      setLoadingVehicles(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoadingBookings(true);
      // Use getMyBookings to get bookings for owner's vehicles only
      const response = await vehicleBookingService.getMyBookings();
      // Filter out cancelled bookings
      const filteredBookings = (response.data || []).filter((booking: any) => booking.status !== 'cancelled');
      setBookings(filteredBookings);
      setErrorBookings(null);
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      if (error?.message?.includes('403') || error?.message?.includes('Access denied')) {
        setErrorBookings('Access denied. Please ensure you are logged in as a vehicle owner.');
      } else {
        setErrorBookings(error?.message || 'Failed to load bookings');
      }
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadStatistics = async () => {
    try {
      // Calculate statistics from current vehicles and bookings
      const ownerVehicles = vehicles;
      const ownerBookings = bookings;
      
      const totalVehicles = ownerVehicles.length;
      const availableVehicles = ownerVehicles.filter(v => v.available !== false).length;
      
      // Calculate booking-based statistics
      const activeBookings = ownerBookings.filter(b => 
        b.status === 'confirmed' || b.status === 'active'
      ).length;
      
      const completedBookings = ownerBookings.filter(b => 
        b.status === 'completed'
      ).length;
      
      // Calculate total revenue from completed bookings
      const totalRevenue = ownerBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, booking) => sum + (booking.pricing?.totalAmount || 0), 0);
      
      setStats({
        totalVehicles: totalVehicles,
        availableVehicles: availableVehicles,
        activeBookings: activeBookings,
        totalRevenue: totalRevenue,
        completedBookings: completedBookings
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const deleteVehicle = async (vehicleId: string, vehicleName: string) => {
    try {
      await vehicleService.deleteVehicle(vehicleId);
      
      // Show success message
      message.success(`Vehicle "${vehicleName}" deleted successfully!`);
      
      // Refresh the vehicle list
      loadVehicles();
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      if (error?.message?.includes('403') || error?.message?.includes('Access denied')) {
        message.error('Access denied. You can only delete your own vehicles.');
      } else if (error?.message?.includes('active bookings')) {
        message.error('Cannot delete vehicle with active bookings. Please wait for bookings to complete.');
      } else {
        message.error(error?.message || 'Failed to delete vehicle. Please try again.');
      }
    }
  };

  const toggleVehicleAvailability = async (vehicleId: string, currentStatus: boolean, vehicleName: string) => {
    try {
      const newStatus = !currentStatus;
      await vehicleService.toggleAvailability(vehicleId, newStatus);
      
      // Show success message
      message.success(`Vehicle "${vehicleName}" is now ${newStatus ? 'active' : 'inactive'}`);
      
      // Refresh the vehicle list to show updated status
      loadVehicles();
    } catch (error: any) {
      console.error('Error toggling vehicle availability:', error);
      message.error(error?.message || 'Failed to update vehicle status. Please try again.');
    }
  };

  const refreshData = () => {
    loadVehicles();
    loadBookings();
  };

  // Update statistics when vehicles or bookings change
  useEffect(() => {
    if (!loadingVehicles && !loadingBookings) {
      loadStatistics();
    }
  }, [vehicles, bookings, loadingVehicles, loadingBookings]);

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 pt-24 pb-12 flex-1">
        {/* Dashboard Title */}
        <div className="mb-8 mt-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Vehicle Owner Dashboard
          </h1>
          {currentOwner && (
            <p className="text-lg text-gray-600 mt-2">
              Welcome, {currentOwner.email}
            </p>
          )}
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-white/30 backdrop-blur border-2 border-blue-400 rounded-2xl p-6 flex flex-col items-center shadow-md">
            <span className="text-blue-500 font-semibold text-sm mb-2">
              Active Bookings
            </span>
            <span className="text-3xl font-bold text-blue-500 mb-1">{stats.activeBookings}</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              Total Vehicles
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1">{stats.totalVehicles}</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              Available Vehicles
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1">{stats.availableVehicles}</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              Completed Bookings
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1">{stats.completedBookings}</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              Revenue
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1"> {stats.totalRevenue} $</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">My Vehicles</h2>
          <div className="flex space-x-3">
            <a
              href="/vehicle-register"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Vehicle</span>
            </a>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {loadingVehicles ? (
          <div className="my-8 text-center">Loading your vehicles…</div>
        ) : errorVehicles ? (
          <div className="my-8 text-center text-red-500">
            Error: {errorVehicles}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles registered</h3>
            <p className="text-gray-500 mb-4">Get started by registering your first vehicle</p>
            <a
              href="/vehicle-register"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Register Your First Vehicle
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">My Vehicles</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Vehicle Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Registration
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Price/Day
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Approval Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Availability
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {vehicle.title || vehicle.name || `${vehicle.make || vehicle.brand || ''} ${vehicle.model}`.trim()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {vehicle.registrationNumber || vehicle.licensePlate || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="capitalize">{(vehicle.vehicleType || vehicle.category) || 'Vehicle'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${vehicle.price?.perDay || vehicle.pricing?.pricePerDay || 0}/day
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            vehicle.approvalStatus?.status === 'approved'
                              ? "bg-green-100 text-green-800"
                              : vehicle.approvalStatus?.status === 'rejected'
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {vehicle.approvalStatus?.status === 'approved' ? 'Approved' :
                           vehicle.approvalStatus?.status === 'rejected' ? 'Rejected' :
                           'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={vehicle.available !== false}
                            onChange={() => 
                              toggleVehicleAvailability(
                                vehicle._id, 
                                vehicle.available !== false, 
                                vehicle.title || vehicle.name || `${vehicle.make || vehicle.brand || ''} ${vehicle.model}`.trim()
                              )
                            }
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            size="small"
                            disabled={vehicle.approvalStatus?.status !== 'approved'}
                          />
                          {vehicle.approvalStatus?.status !== 'approved' && (
                            <span className="text-xs text-gray-500">
                              (Requires approval)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                            className="text-blue-600 hover:underline cursor-pointer px-2 py-1 rounded border border-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/vehicle-edit/${vehicle._id}`)}
                            className="text-green-600 hover:underline cursor-pointer px-2 py-1 rounded border border-green-600 hover:bg-green-50 transition-colors"
                          >
                            Edit
                          </button>
                          <Popconfirm
                            title="Delete the vehicle"
                            description={`Are you sure you want to delete "${vehicle.title || vehicle.vehicleType || 'this vehicle'}"? This action cannot be undone.`}
                            onConfirm={() => deleteVehicle(vehicle._id, vehicle.title || vehicle.vehicleType || 'vehicle')}
                            onCancel={() => message.info('Delete cancelled')}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button 
                              danger 
                              size="small"
                              style={{height: '32px'}}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          </Popconfirm>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vehicle Bookings Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          
          {loadingBookings ? (
            <div className="my-8 text-center">Loading bookings…</div>
          ) : errorBookings ? (
            <div className="my-8 text-center text-red-500">
              Error: {errorBookings}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Booking ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Vehicle
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        End Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Admin Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.slice(0, 10).map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 break-all">
                          {booking.bookingId || booking._id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {booking.customer?.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {booking.vehicle?.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {booking.booking?.startDate ? new Date(booking.booking.startDate).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {booking.booking?.endDate ? new Date(booking.booking.endDate).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Dollar {booking.pricing?.totalAmount || 0}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'approved' || booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {booking.status === 'approved' ? 'Approved' : 
                             booking.status === 'confirmed' ? 'Confirmed' :
                             booking.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={booking.ownerStatus === 'confirmed' ? 'approved' : booking.status === 'cancelled' ? 'cancel' : 'pending'}
                            onChange={(e) => handleOwnerStatusChange(booking._id, e.target.value)}
                            className={`px-3 py-1 text-xs font-semibold rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              booking.ownerStatus === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="cancel">Cancel</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleViewBookingDetails(booking)}
                            className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50 transition-colors text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VehicleOwner;
