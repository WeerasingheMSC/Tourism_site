// src/pages/AdminBookingTable.tsx
import React, { useState, useEffect } from "react";
import { getAllBookings, updateBookingStatus } from "../../api/bookings"; // ← use the new admin helper
import { useNavigate } from "react-router-dom";

interface BookingData {
  _id: string;
  packageId: {
    _id: string;
    name: string; // backend now populates this via `.populate('packageId','title')`
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  whatsappNumber: string;
  createdAt: string;
}

// Tailwind badge colors
const getStateColor = (state: string) => {
  switch (state) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "confirmed":
      return "bg-green-100 text-green-700 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const AdminBookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // (1) Call the admin endpoint
    getAllBookings()
      .then((res) => setBookings(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="my-8 text-center">Loading bookings…</div>;
  if (error)
    return <div className="my-8 text-center text-red-500">Error: {error}</div>;

  const handleStatusChange = (id: string, newStatus: string) => {
    updateBookingStatus(id, newStatus) // call PUT /api/bookings/:id/status
      .then(() => {
        // update state so table refreshes instantly
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
      })
      .catch((err) => {
        console.error("Failed to update status:", err);
        alert(err.response?.data?.message || err.message);
      });
  };

  return (
    <div className="">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Tourist
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Package
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  WhatsApp
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {b._id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {b.userId.name} ({b.userId.email})
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {b.packageId.name}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={b.status} // current status
                      onChange={
                        (e) => handleStatusChange(b._id, e.target.value) // fire update
                      }
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStateColor(
                        b.status
                      )}`}
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {b.whatsappNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  {/* View button (you can hook this up with navigate or Link) */}
                <td className="px-6 py-4">
                  <button 
                  onClick={() => navigate(`/packages/${b.packageId._id}`)}
                  className="text-blue-500 hover:text-blue-700 transition-colors p-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 
                           0 002 2h10a2 2 0 002-2v-4M14 
                           4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingTable;
