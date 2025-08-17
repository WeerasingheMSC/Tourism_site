// src/components/Admin/AdminVehicleTable.tsx
import React, { useState, useEffect } from "react";
import { message } from "antd";
import { ExternalLink } from "lucide-react";

interface Vehicle {
  _id: string;
  title?: string;
  name?: string;
  vehicleType?: string;
  category?: string;
  make?: string;
  brand?: string;
  model: string;
  year: number;
  registrationNumber?: string;
  licensePlate?: string;
  seatCapacity?: number;
  seatingCapacity?: number;
  approvalStatus?: {
    status: "pending" | "approved" | "rejected";
    adminNotes?: string;
    reviewedAt?: Date;
    reviewedBy?: string;
  };
  ownerId?: string | {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    businessName?: string;
    personalInfo?: {
      fullName?: string;
      nicNumber?: string;
    };
    contactInfo?: {
      email?: string;
      phone?: string;
    };
  };
  createdAt: Date;
}

// API functions for vehicle management
const vehicleAPI = {
  getAllVehicles: async (): Promise<Vehicle[]> => {
    const token = localStorage.getItem('authToken');
    
    // Try admin endpoint first
    try {
      const response = await fetch('http://localhost:5001/api/vehicles/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      // Admin endpoint failed, try regular endpoint
    }
    
    // Fallback to regular endpoint
    const response = await fetch('http://localhost:5001/api/vehicles', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch vehicles');
    }
    
    const result = await response.json();
    return result.data || result;
  },

  getPendingVehicles: async (): Promise<Vehicle[]> => {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:5001/api/vehicles/pending', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch pending vehicles');
    }
    
    const data = await response.json();
    return data;
  },

  approveRejectVehicle: async (vehicleId: string, status: "pending" | "approved" | "rejected", adminNotes?: string) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    console.log('Making API call to update vehicle status:', { vehicleId, status, token: token.substring(0, 20) + '...' });
    
    const response = await fetch(`http://localhost:5001/api/vehicles/${vehicleId}/approve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, adminNotes }),
    });
    
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.log('API error response:', errorData);
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to update vehicle status`);
    }
    
    const result = await response.json();
    console.log('API success response:', result);
    return result;
  },
};

interface AdminVehicleTableProps {
  onCountsChange?: (counts: { total: number; pending: number; approved: number; rejected: number }) => void;
}

const AdminVehicleTable: React.FC<AdminVehicleTableProps> = ({ onCountsChange }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]); // For counting purposes
  const [ownerPhones, setOwnerPhones] = useState<{[userId: string]: string}>({}); // Cache for phone numbers
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Fetch owner phone number from vehicle owner details endpoint
  const fetchOwnerPhone = async (userId: string): Promise<string> => {
    try {
      // Check cache first
      if (ownerPhones[userId]) {
        return ownerPhones[userId];
      }

      const response = await fetch(`http://localhost:5001/api/vehicle-owners/user/${userId}`);
      
      if (response.ok) {
        const result = await response.json();
        const phone = result.data?.phone || 'N/A';
        
        // Cache the result
        setOwnerPhones(prev => ({
          ...prev,
          [userId]: phone
        }));
        
        return phone;
      }
    } catch (error) {
      console.error('Error fetching owner phone:', error);
    }
    
    return 'N/A';
  };

  // Fetch vehicles based on filter
  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Always fetch all vehicles first for counting purposes
      const allData = await vehicleAPI.getAllVehicles();
      
      // Update allVehicles for counting (always keep the full list)
      setAllVehicles(allData);
      
      // Filter the displayed vehicles based on current filter
      let displayedVehicles = allData;
      
      if (filter === "pending") {
        displayedVehicles = allData.filter(vehicle => 
          !vehicle.approvalStatus || vehicle.approvalStatus.status === 'pending'
        );
      } else if (filter === "approved") {
        displayedVehicles = allData.filter(vehicle => 
          vehicle.approvalStatus?.status === 'approved'
        );
      } else if (filter === "rejected") {
        displayedVehicles = allData.filter(vehicle => 
          vehicle.approvalStatus?.status === 'rejected'
        );
      }
      // For "all", displayedVehicles remains as allData
      
      setVehicles(displayedVehicles);
      
    } catch (err: any) {
      console.error("Get vehicles error:", err);
      setError(err.message || "Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles on mount and when filter changes
  useEffect(() => {
    fetchVehicles();
  }, [filter]);

  // Pre-fetch phone numbers when vehicles are loaded
  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      const userIdsToFetch = allVehicles
        .map(vehicle => {
          if (typeof vehicle.ownerId === 'string') {
            return vehicle.ownerId;
          } else if (vehicle.ownerId?._id) {
            return vehicle.ownerId._id;
          }
          return null;
        })
        .filter((id): id is string => id !== null && !ownerPhones[id]);

      // Fetch phone numbers for user IDs that aren't already cached
      for (const userId of userIdsToFetch) {
        fetchOwnerPhone(userId);
      }
    };

    if (allVehicles.length > 0) {
      fetchPhoneNumbers();
    }
  }, [allVehicles, ownerPhones]);

  // Notify parent component of count changes
  useEffect(() => {
    if (onCountsChange && allVehicles.length > 0) {
      const counts = {
        total: allVehicles.length,
        pending: allVehicles.filter(v => !v.approvalStatus || v.approvalStatus.status === 'pending').length,
        approved: allVehicles.filter(v => v.approvalStatus?.status === 'approved').length,
        rejected: allVehicles.filter(v => v.approvalStatus?.status === 'rejected').length,
      };
      onCountsChange(counts);
    }
  }, [allVehicles, onCountsChange]);

  // Handle status change from dropdown
  const handleStatusChange = async (vehicleId: string, newStatus: "pending" | "approved" | "rejected") => {
    try {
      console.log('Attempting to change vehicle status:', { vehicleId, newStatus });
      
      // Call API for all status changes
      const result = await vehicleAPI.approveRejectVehicle(vehicleId, newStatus);
      console.log('Status change API response:', result);
      
      // Update the vehicle status in the local state
      setVehicles((prev) => 
        prev.map((vehicle) => 
          vehicle._id === vehicleId 
            ? { 
                ...vehicle, 
                approvalStatus: { 
                  ...vehicle.approvalStatus, 
                  status: newStatus,
                  reviewedAt: new Date()
                }
              }
            : vehicle
        )
      );
      
      // Also update the allVehicles array for correct counts
      setAllVehicles((prev) => 
        prev.map((vehicle) => 
          vehicle._id === vehicleId 
            ? { 
                ...vehicle, 
                approvalStatus: { 
                  ...vehicle.approvalStatus, 
                  status: newStatus,
                  reviewedAt: new Date()
                }
              }
            : vehicle
        )
      );
      
      message.success(`Vehicle status changed to ${newStatus} successfully`);
      
      // Optionally refresh the data to ensure consistency
      setTimeout(() => {
        fetchVehicles();
      }, 1000);
      
    } catch (err: any) {
      console.error("Status change failed:", err);
      
      // More detailed error message
      let errorMessage = `Failed to change status to ${newStatus}`;
      if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      message.error(errorMessage);
      
      // Refresh data in case of error to show correct state
      fetchVehicles();
    }
  };

  // Get vehicle name
  const getVehicleName = (vehicle: Vehicle) => {
    return vehicle.title || vehicle.name || `${vehicle.make || vehicle.brand || ''} ${vehicle.model}`.trim();
  };

  // Get vehicle type
  const getVehicleType = (vehicle: Vehicle) => {
    return vehicle.vehicleType || vehicle.category || 'Vehicle';
  };

  // Get registration number
  const getRegistrationNumber = (vehicle: Vehicle) => {
    return vehicle.registrationNumber || vehicle.licensePlate || 'N/A';
  };

  // Get seating capacity
  const getSeatingCapacity = (vehicle: Vehicle) => {
    return vehicle.seatCapacity || vehicle.seatingCapacity || 'N/A';
  };

  // Get owner name
  const getOwnerName = (vehicle: Vehicle) => {
    if (!vehicle.ownerId || typeof vehicle.ownerId === 'string') {
      return typeof vehicle.ownerId === 'string' 
        ? `Owner ID: ${(vehicle.ownerId as string).substring(0, 8)}...`
        : 'No Owner Data';
    }
    
    // Try User model fields first
    if (vehicle.ownerId.name) {
      return vehicle.ownerId.name;
    }
    
    // Try business name
    if (vehicle.ownerId.businessName) {
      return vehicle.ownerId.businessName;
    }
    
    // Try personal info from VehicleOwner structure (fallback)
    if (vehicle.ownerId.personalInfo?.fullName) {
      return vehicle.ownerId.personalInfo.fullName;
    }
    
    // Try email as last resort
    if (vehicle.ownerId.email) {
      return vehicle.ownerId.email;
    }
    
    return 'Unknown Owner';
  };

  // Get owner phone number
  const getOwnerPhone = (vehicle: Vehicle) => {
    if (!vehicle.ownerId || typeof vehicle.ownerId === 'string') {
      if (typeof vehicle.ownerId === 'string') {
        // Fetch from vehicle owner details if we have a user ID
        const cachedPhone = ownerPhones[vehicle.ownerId];
        if (cachedPhone !== undefined) {
          return cachedPhone;
        }
        
        // Trigger async fetch (this will update the state and cause re-render)
        fetchOwnerPhone(vehicle.ownerId);
        return 'Loading...';
      }
      return 'N/A';
    }
    
    // Try User model phone field first
    if (vehicle.ownerId.phone) {
      return vehicle.ownerId.phone;
    }
    
    // Try VehicleOwner structure (fallback)
    if (vehicle.ownerId.contactInfo?.phone) {
      return vehicle.ownerId.contactInfo.phone;
    }
    
    // If we have the user ID from populated object, try fetching from vehicle owner details
    if (vehicle.ownerId._id) {
      const cachedPhone = ownerPhones[vehicle.ownerId._id];
      if (cachedPhone !== undefined) {
        return cachedPhone;
      }
      
      // Trigger async fetch
      fetchOwnerPhone(vehicle.ownerId._id);
      return 'Loading...';
    }
    
    return 'N/A';
  };

  // Calculate filter counts
  const getFilterCounts = () => {
    return {
      all: allVehicles.length,
      pending: allVehicles.filter(v => !v.approvalStatus || v.approvalStatus.status === 'pending').length,
      approved: allVehicles.filter(v => v.approvalStatus?.status === 'approved').length,
      rejected: allVehicles.filter(v => v.approvalStatus?.status === 'rejected').length,
    };
  };

  const counts = getFilterCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>Loading vehicles…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Filter buttons */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Management</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === "all"
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Vehicles ({counts.all})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === "pending"
                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending ({counts.pending})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === "approved"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Approved ({counts.approved})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === "rejected"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected ({counts.rejected})
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Vehicle Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Owner
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Model & Year
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Registration
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Seats
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Submitted
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                View
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                  No vehicles found for the selected filter
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr
                  key={vehicle._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {getVehicleName(vehicle)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">{getOwnerName(vehicle)}</span>
                      {typeof vehicle.ownerId === 'object' && (
                        vehicle.ownerId?.email || vehicle.ownerId?.contactInfo?.email
                      ) && (
                        <span className="text-xs text-gray-500">
                          {vehicle.ownerId.email || vehicle.ownerId.contactInfo?.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getOwnerPhone(vehicle)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className="capitalize">{getVehicleType(vehicle)}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {vehicle.model} ({vehicle.year})
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                    {getRegistrationNumber(vehicle)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getSeatingCapacity(vehicle)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={vehicle.approvalStatus?.status || 'pending'}
                      onChange={(e) => handleStatusChange(vehicle._id, e.target.value as "pending" | "approved" | "rejected")}
                      className={`px-3 py-1 rounded-md border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        (vehicle.approvalStatus?.status || 'pending') === 'approved'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : (vehicle.approvalStatus?.status || 'pending') === 'rejected'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(vehicle.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <a
                      href={`/vehicles/${vehicle._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-500 hover:text-blue-700 p-1"
                      title="View Vehicle Details"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVehicleTable;
