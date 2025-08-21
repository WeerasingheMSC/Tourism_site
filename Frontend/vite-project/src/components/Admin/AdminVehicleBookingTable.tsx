// src/components/Admin/AdminVehicleBookingTable.tsx
import React, { useState, useEffect } from "react";
import { message } from "antd";
import { ExternalLink } from "lucide-react";
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
    owner?: {
      name: string;
      email: string;
      phone: string;
      businessName?: string;
      businessAddress?: string;
      licenseNumber?: string;
      rating?: number;
    };
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
  };
  payment: {
    method: "cash" | "card" | "bank_transfer" | "online";
    status: "pending" | "partial" | "paid" | "refunded";
    advanceAmount?: number;
    remainingAmount?: number;
    transactionId?: string;
  };
  status:
    | "pending"
    | "confirmed"
    | "active"
    | "completed"
    | "cancelled"
    | "approved";
  adminStatus: "pending" | "completed";
  ownerStatus: "pending" | "confirmed";
  notes?: string;
  rating?: number;
  review?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API functions for vehicle booking management
const vehicleBookingAPI = {
  getAllBookings: async (): Promise<VehicleBooking[]> => {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${API_BASE_URL}/api/vehicle-bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vehicle bookings");
    }

    const result = await response.json();
    return result.data || result;
  },

  updateBookingStatus: async (
    bookingId: string,
    status?:
      | "pending"
      | "confirmed"
      | "active"
      | "completed"
      | "cancelled"
      | "approved",
    adminStatus?: "pending" | "completed",
    ownerStatus?: "pending" | "confirmed",
    cancellationReason?: string
  ) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("Making API call to update booking status:", {
      bookingId,
      status,
      adminStatus,
      ownerStatus,
      token: token.substring(0, 20) + "...",
    });

    const requestBody: any = {};
    if (status) requestBody.status = status;
    if (adminStatus) requestBody.adminStatus = adminStatus;
    if (ownerStatus) requestBody.ownerStatus = ownerStatus;
    if (cancellationReason) requestBody.cancellationReason = cancellationReason;

    const response = await fetch(
      `${API_BASE_URL}/api/vehicle-bookings/${bookingId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("API response status:", response.status);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      console.log("API error response:", errorData);
      throw new Error(
        errorData.message ||
          `HTTP ${response.status}: Failed to update booking status`
      );
    }

    const result = await response.json();
    console.log("API success response:", result);
    return result;
  },
};

interface AdminVehicleBookingTableProps {
  onCountsChange?: (counts: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    approved: number;
  }) => void;
}

const AdminVehicleBookingTable: React.FC<AdminVehicleBookingTableProps> = ({
  onCountsChange,
}) => {
  const [bookings, setBookings] = useState<VehicleBooking[]>([]);
  const [allBookings, setAllBookings] = useState<VehicleBooking[]>([]); // For counting purposes
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");
  const [selectedBooking, setSelectedBooking] = useState<VehicleBooking | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);

  // Fetch bookings based on filter
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      // Always fetch all bookings first for counting purposes
      const allData = await vehicleBookingAPI.getAllBookings();

      // Filter out cancelled bookings from allData
      const filteredData = allData.filter(
        (booking) => booking.status !== "cancelled"
      );

      // Update allBookings for counting (excluding cancelled bookings)
      setAllBookings(filteredData);

      // Filter the displayed bookings based on current filter
      let displayedBookings = filteredData;

      if (filter === "pending") {
        displayedBookings = filteredData.filter(
          (booking) => booking.status === "pending"
        );
      } else if (filter === "confirmed") {
        displayedBookings = filteredData.filter(
          (booking) => booking.status === "confirmed"
        );
      } else if (filter === "completed") {
        displayedBookings = filteredData.filter(
          (booking) => booking.status === "completed"
        );
      } else if (filter === "cancelled") {
        displayedBookings = filteredData.filter(
          (booking) => booking.status === "cancelled"
        );
      }
      // For "all", displayedBookings remains as filteredData

      setBookings(displayedBookings);

      // Calculate and send counts to parent component (excluding cancelled bookings)
      if (onCountsChange) {
        const counts = {
          total: filteredData.length,
          pending: filteredData.filter((b) => b.status === "pending").length,
          confirmed: filteredData.filter((b) => b.status === "confirmed")
            .length,
          completed: filteredData.filter((b) => b.status === "completed")
            .length,
          cancelled: 0, // Always 0 since we're filtering out cancelled bookings
          approved: filteredData.filter((b) => b.status === "approved").length,
        };
        onCountsChange(counts);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to fetch vehicle bookings. Please try again.");
      message.error("Failed to fetch vehicle bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  // Handle legacy status change from dropdown (for backwards compatibility)
  const handleStatusChange = async (
    bookingId: string,
    newStatus: "pending" | "confirmed" | "cancelled" | "approved"
  ) => {
    try {
      console.log("🔄 AdminVehicleBookingTable - Starting status change:", {
        bookingId,
        newStatus,
      });
      console.log(
        "🔄 AdminVehicleBookingTable - Current auth token:",
        localStorage.getItem("authToken") ? "Present" : "Missing"
      );

      // Determine adminStatus based on the new status
      let adminStatus: "pending" | "completed" = "pending";
      if (newStatus === "approved" || newStatus === "confirmed") {
        adminStatus = "completed";
      }

      // Call API for status change with both status and adminStatus
      const result = await vehicleBookingAPI.updateBookingStatus(
        bookingId,
        newStatus,
        adminStatus, // adminStatus
        undefined, // ownerStatus
        undefined // cancellationReason
      );
      console.log(
        "✅ AdminVehicleBookingTable - Status change API response:",
        result
      );

      // Update the booking status in the local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: newStatus,
                adminStatus: adminStatus,
                updatedAt: new Date(),
              }
            : booking
        )
      );

      // Also update the allBookings array for correct counts
      setAllBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: newStatus,
                adminStatus: adminStatus,
                updatedAt: new Date(),
              }
            : booking
        )
      );

      // Update counts (excluding cancelled bookings)
      if (onCountsChange) {
        const updatedBookings = allBookings.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        );
        // Filter out cancelled bookings for counts
        const filteredUpdatedBookings = updatedBookings.filter(
          (b) => b.status !== "cancelled"
        );
        const counts = {
          total: filteredUpdatedBookings.length,
          pending: filteredUpdatedBookings.filter((b) => b.status === "pending")
            .length,
          confirmed: filteredUpdatedBookings.filter(
            (b) => b.status === "confirmed"
          ).length,
          completed: filteredUpdatedBookings.filter(
            (b) => b.status === "completed"
          ).length,
          cancelled: 0, // Always 0 since we're filtering out cancelled bookings
          approved: filteredUpdatedBookings.filter(
            (b) => b.status === "approved"
          ).length,
        };
        onCountsChange(counts);
      }

      message.success(`Booking status changed to ${newStatus} successfully`);

      // Optionally refresh the data to ensure consistency (matching AdminVehicleTable pattern)
      setTimeout(() => {
        fetchBookings();
      }, 1000);
    } catch (err: any) {
      console.error("❌ AdminVehicleBookingTable - Status change failed:", err);
      console.error("❌ AdminVehicleBookingTable - Error details:", {
        message: err.message,
        stack: err.stack,
        response: err.response,
      });

      // More detailed error message (matching AdminVehicleTable pattern)
      let errorMessage = `Failed to change status to ${newStatus}`;
      if (err.message) {
        errorMessage += `: ${err.message}`;
      }

      message.error(errorMessage);

      // Refresh data in case of error to show correct state (matching AdminVehicleTable pattern)
      fetchBookings();
    }
  };

  const handleViewDetails = (booking: VehicleBooking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "approved":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          {[
            { key: "all", label: "All Bookings", count: allBookings.length },
            {
              key: "pending",
              label: "Pending",
              count: allBookings.filter((b) => b.status === "pending").length,
            },
            {
              key: "confirmed",
              label: "Confirmed",
              count: allBookings.filter((b) => b.status === "confirmed").length,
            },
            {
              key: "completed",
              label: "Completed",
              count: allBookings.filter((b) => b.status === "completed").length,
            },
            { key: "cancelled", label: "Cancelled", count: 0 }, // Always 0 since we filter out cancelled bookings
          ].map((tab) => (
            <button
              key={tab.key}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setFilter(tab.key as typeof filter)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rental Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                View
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 font-mono">
                      {booking.bookingId}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.customer.phone}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.customer.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {booking.vehicle.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.vehicle.licensePlate}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.vehicle.category}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.booking.startDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {formatDate(booking.booking.endDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.booking.duration} days
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                     {booking.pricing.totalAmount}$
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.pricing.rentalType && booking.pricing.basePrice ? (
                      <span> {booking.pricing.basePrice}$/{booking.pricing.unit || 'day'}</span>
                    ) : (
                      <span> {booking.pricing.basePrice}$/day</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {booking.payment.method}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={booking.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as
                        | "pending"
                        | "confirmed"
                        | "cancelled"
                        | "approved";
                      handleStatusChange(booking._id, newStatus);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    <option value="pending">PENDING</option>
                    <option value="confirmed">CONFIRMED</option>
                    <option value="cancelled">CANCELLED</option>
                    <option value="approved">APPROVED</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="text-blue-600 hover:text-blue-900 flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No {filter !== "all" ? filter : ""} vehicle bookings found.
        </div>
      )}

      {/* Modal for booking details */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Booking Details - {selectedBooking.bookingId}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="mt-4">
                {/* Top Row - Customer and Vehicle Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedBooking.customer.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedBooking.customer.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedBooking.customer.phone}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {selectedBooking.customer.address || "Not provided"}
                      </p>
                      {selectedBooking.customer.driverLicense && (
                        <p>
                          <span className="font-medium">Driver License:</span>{" "}
                          {selectedBooking.customer.driverLicense}
                        </p>
                      )}
                      {selectedBooking.customer.idNumber && (
                        <p>
                          <span className="font-medium">ID Number:</span>{" "}
                          {selectedBooking.customer.idNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Vehicle Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Vehicle:</span>{" "}
                        {selectedBooking.vehicle.name}
                      </p>
                      <p>
                        <span className="font-medium">License Plate:</span>{" "}
                        {selectedBooking.vehicle.licensePlate}
                      </p>
                      <p>
                        <span className="font-medium">Category:</span>{" "}
                        {selectedBooking.vehicle.category}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Second Row - Vehicle Owner Details (Full Width) */}
                <div className="mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Vehicle Owner Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {/* Owner Contact Details */}
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Contact Information</h5>
                        <div className="space-y-1">
                          <p>
                            <span className="font-medium">Owner Name:</span>{" "}
                            <span className="text-gray-600">
                              {selectedBooking.vehicle.owner?.name || "Not Available"}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            <span className="text-gray-600">
                              {selectedBooking.vehicle.owner?.email || "Not Available"}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            <span className="text-gray-600">
                              {selectedBooking.vehicle.owner?.phone || "Not Available"}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Business Details */}
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Business Information</h5>
                        <div className="space-y-1">
                          <p>
                            <span className="font-medium">Business Name:</span>{" "}
                            <span className="text-gray-600">
                              {selectedBooking.vehicle.owner?.businessName || "Not Available"}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">Business Address:</span>{" "}
                            <span className="text-gray-600">
                              {selectedBooking.vehicle.owner?.businessAddress || "Not Available"}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">License Number:</span>{" "}
                            <span className="text-gray-600">
                              {selectedBooking.vehicle.owner?.licenseNumber || "Not Available"}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Rating & Status */}
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Owner Rating</h5>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            {selectedBooking.vehicle.owner?.rating ? (
                              <>
                                <span className="text-gray-600">{selectedBooking.vehicle.owner?.rating || 0}/5</span>
                                <div className="flex ml-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg 
                                      key={star} 
                                      className={`w-4 h-4 ${star <= (selectedBooking.vehicle.owner?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                                      fill="currentColor" 
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-gray-600">Not Rated</span>
                                <div className="flex ml-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                          {selectedBooking.vehicle.owner ? (
                            <p className="text-xs text-green-600 italic">
                              ✓ Owner details loaded successfully
                            </p>
                          ) : (
                            <p className="text-xs text-orange-500 italic">
                              ⚠ Owner details not available in this booking
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Third Row - Booking and Pricing Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Booking Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Booking Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Start Date:</span>{" "}
                        {formatDateTime(selectedBooking.booking.startDate)}
                      </p>
                      <p>
                        <span className="font-medium">End Date:</span>{" "}
                        {formatDateTime(selectedBooking.booking.endDate)}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {selectedBooking.booking.duration} days
                      </p>
                      <p>
                        <span className="font-medium">Pickup:</span>{" "}
                        {selectedBooking.booking.pickupLocation}
                      </p>
                      <p>
                        <span className="font-medium">Drop-off:</span>{" "}
                        {selectedBooking.booking.dropoffLocation}
                      </p>
                      <p>
                        <span className="font-medium">With Driver:</span>{" "}
                        {selectedBooking.booking.driverRequired ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Pricing Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">
                          {selectedBooking.pricing.rentalType === 'hourly' ? 'Hourly Rate:' :
                           selectedBooking.pricing.rentalType === 'kilometer' ? 'Per Km Rate:' :
                           'Daily Rate:'}
                        </span> {selectedBooking.pricing.basePrice}$
                        {selectedBooking.pricing.unit && `/${selectedBooking.pricing.unit}`}
                      </p>
                      {selectedBooking.pricing.rentalType && (
                        <p>
                          <span className="font-medium">Rental Type:</span>{" "}
                          {selectedBooking.pricing.rentalType === 'daily' ? 'Daily Rental' :
                           selectedBooking.pricing.rentalType === 'hourly' ? 'Hourly Rental' :
                           selectedBooking.pricing.rentalType === 'kilometer' ? 'Per Kilometer' :
                           'Daily Rental'}
                        </p>
                      )}
                      {selectedBooking.pricing.driverCharge && (
                        <p>
                          <span className="font-medium">Driver Charge:</span> {selectedBooking.pricing.driverCharge}$
                        </p>
                      )}
                      {selectedBooking.pricing.insurance && (
                        <p>
                          <span className="font-medium">Insurance:</span> {selectedBooking.pricing.insurance}$
                        </p>
                      )}
                      <p className="font-medium text-green-600">
                        <span className="font-medium text-gray-900">Total:</span>{" "}
                         {selectedBooking.pricing.totalAmount}$
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status and Notes */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Status & Additional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            selectedBooking.status
                          )}`}
                        >
                          {selectedBooking.status.toUpperCase()}
                        </span>
                      </p>
                      <p className="mt-2">
                        <span className="font-medium">Payment Status:</span>
                        <span
                          className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedBooking.payment.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {selectedBooking.payment.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">Created:</span>{" "}
                        {formatDateTime(selectedBooking.createdAt)}
                      </p>
                      <p>
                        <span className="font-medium">Updated:</span>{" "}
                        {formatDateTime(selectedBooking.updatedAt)}
                      </p>
                    </div>
                  </div>
                  {selectedBooking.notes && (
                    <div className="mt-3">
                      <p>
                        <span className="font-medium">Notes:</span>{" "}
                        {selectedBooking.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {selectedBooking.status === "pending" && (
                  <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedBooking._id, "confirmed");
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve Booking
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedBooking._id, "cancelled");
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVehicleBookingTable;
