// src/components/Admin/AdminVehiclesPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import AdminVehicleTable from './AdminVehicleTable';
import VehicleBookingsTable from './VehicleBookingsTable';
import AdminVehicleBookingTable from './AdminVehicleBookingTable';

interface Vehicle {
  _id: string;
  approvalStatus?: {
    status: "pending" | "approved" | "rejected";
  };
}

const AdminVehiclesPage: React.FC = () => {
  const [vehicleCounts, setVehicleCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch vehicle counts
  const fetchVehicleCounts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Try admin endpoint first
      let response;
      try {
        response = await fetch('http://localhost:5000/api/vehicles/admin/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Admin endpoint failed');
        }
      } catch (error) {
        // Fallback to regular endpoint
        response = await fetch('http://localhost:5000/api/vehicles', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
      }
      
      const result = await response.json();
      const vehicles: Vehicle[] = result.data || result;
      
      const counts = {
        total: vehicles.length,
        pending: vehicles.filter(v => !v.approvalStatus || v.approvalStatus.status === 'pending').length,
        approved: vehicles.filter(v => v.approvalStatus?.status === 'approved').length,
        rejected: vehicles.filter(v => v.approvalStatus?.status === 'rejected').length,
      };
      
      setVehicleCounts(counts);
    } catch (error) {
      console.error('Error fetching vehicle counts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleCounts();
  }, []);

  // ✅ Make the handler stable + avoid redundant state updates
  const handleCountsChange = useCallback((counts: { total: number; pending: number; approved: number; rejected: number }) => {
    setVehicleCounts(prev => {
      const same =
        prev.total === counts.total &&
        prev.pending === counts.pending &&
        prev.approved === counts.approved &&
        prev.rejected === counts.rejected;

      return same ? prev : counts;
    });
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 pt-24 pb-12 flex-1">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Vehicle Management
          </h1>
          <p className="text-gray-600">
            Manage all registered vehicles - review, approve, or reject vehicle applications
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/30 backdrop-blur border-2 border-yellow-400 rounded-2xl p-6 flex flex-col items-center shadow-md">
            <span className="text-yellow-600 font-semibold text-sm mb-2">Pending Vehicles</span>
            <span className="text-3xl font-bold text-yellow-600 mb-1">
              {loading ? '-' : vehicleCounts.pending}
            </span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">Approved Vehicles</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '-' : vehicleCounts.approved}
            </span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">Rejected Vehicles</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '-' : vehicleCounts.rejected}
            </span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">Total Vehicles</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '-' : vehicleCounts.total}
            </span>
          </div>
        </div>

        {/* Pending Vehicles Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Pending Vehicle Approvals</h2>
          <p className="text-gray-500 mb-4">Review and approve vehicle owner registrations</p>
          <div className="rounded-2xl border border-gray-300 overflow-hidden bg-white">
            <AdminVehicleTable onCountsChange={handleCountsChange} />
          </div>
        </div>

        

        {/* Vehicle Bookings Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1 mt-8">Vehicle Bookings</h2>
        <p className="text-gray-500 mb-4">Manage customer vehicle booking requests and approvals</p>
        <div className="rounded-2xl border border-gray-300 overflow-hidden mb-12 bg-white">
          <AdminVehicleBookingTable onCountsChange={(counts) => console.log('Vehicle booking counts:', counts)} />
        </div>

        {/* Vehicle Bookings Section */}
        
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Vehicle Owner Status</h2>
          <p className="text-gray-500 mb-4">Vehicle Owner staus for their booking </p>
          <div className="rounded-2xl border border-gray-300 overflow-hidden bg-white">
            <VehicleBookingsTable />
          </div>
        
        
      </main>
    </div>
  );
};

export default AdminVehiclesPage;
