import React, { useState, useEffect } from 'react';
import { vehicleService, vehicleBookingService } from '../../api/vehicleBookings';
import type { Vehicle, VehicleBooking } from '../../api/vehicleBookings';

const VehicleDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<VehicleBooking[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [errorVehicles, setErrorVehicles] = useState<string | null>(null);
  const [errorBookings, setErrorBookings] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    activeBookings: 0,
    totalRevenue: 0,
    completedBookings: 0
  });

  useEffect(() => {
    loadVehicles();
    loadBookings();
    loadStatistics();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const response = await vehicleService.getAllVehicles();
      setVehicles(response.data || []);
      setErrorVehicles(null);
    } catch (error: any) {
      console.error('Error loading vehicles:', error);
      setErrorVehicles(error?.message || 'Failed to load vehicles');
    } finally {
      setLoadingVehicles(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoadingBookings(true);
      const response = await vehicleBookingService.getAllBookings();
      setBookings(response.data || []);
      setErrorBookings(null);
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      setErrorBookings(error?.message || 'Failed to load bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const [vehicleStats, bookingStats] = await Promise.all([
        vehicleService.getStatistics(),
        vehicleBookingService.getStatistics()
      ]);
      
      setStats({
        totalVehicles: vehicleStats.data?.overview?.totalVehicles || 0,
        availableVehicles: vehicleStats.data?.overview?.availableVehicles || 0,
        activeBookings: bookingStats.data?.overview?.activeBookings || 0,
        totalRevenue: bookingStats.data?.overview?.totalRevenue || 0,
        completedBookings: bookingStats.data?.overview?.completedBookings || 0
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };



  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 pt-24 pb-12 flex-1">
        {/* Dashboard Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 mt-2">
          Vehicle Owner Dashboard
        </h1>

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
            <span className="text-3xl font-bold text-gray-900 mb-1">${stats.totalRevenue}</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Vehicles</h2>

        {loadingVehicles ? (
          <div className="my-8 text-center">Loading your vehicles…</div>
        ) : errorVehicles ? (
          <div className="my-8 text-center text-red-500">
            Error: {errorVehicles}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Vehicle ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      License Plate
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Price/Day
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 break-all">
                        {vehicle._id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {vehicle.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {vehicle.licensePlate}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {vehicle.category?.toUpperCase() || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        ${vehicle.pricing?.pricePerDay || 0}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            vehicle.available
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {vehicle.available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={`/vehicles/${vehicle._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
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
                        Status
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
                          ${booking.pricing?.totalAmount || 0}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "confirmed" || booking.status === "active"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "Unknown"}
                          </span>
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

export default VehicleDashboard;
