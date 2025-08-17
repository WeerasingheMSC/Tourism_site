// src/pages/AdminBookingTable.tsx
import React, { useState, useEffect, useMemo } from "react";
import { getAllBookings, updateBookingStatus } from "../../api/bookings";
import { useNavigate } from "react-router-dom";

interface BookingData {
  _id: string;
  packageId: { _id: string; name: string } | null;
  userId: { _id: string; name: string; email: string } | null;
  status: "pending" | "confirmed" | "cancelled";
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

const statusOptions: Array<BookingData["status"]> = [
  "pending",
  "confirmed",
  "cancelled",
];

const AdminBookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // NEW: filters
  const [statusFilter, setStatusFilter] = useState<
    "all" | BookingData["status"]
  >("all");
  const [searchId, setSearchId] = useState<string>("");

  useEffect(() => {
    getAllBookings()
      .then((res) => setBookings(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Derived list with filters (client-side)
  const visible = useMemo(() => {
    const q = searchId.trim().toLowerCase();
    return bookings.filter((b) => {
      const statusOK =
        statusFilter === "all" ? true : b.status === statusFilter;
      const idOK = q ? b._id.toLowerCase().includes(q) : true;
      return statusOK && idOK;
    });
  }, [bookings, statusFilter, searchId]);

  const handleStatusChange = (id: string, newStatus: BookingData["status"]) => {
    updateBookingStatus(id, newStatus)
      .then(() => {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
      })
      .catch((err) => {
        console.error("Failed to update status:", err);
        alert(err.response?.data?.message || err.message);
      });
  };

  if (loading) return <div className="my-8 text-center">Loading bookings…</div>;
  if (error)
    return <div className="my-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div>
      {/* Control bar: search + status filter */}
      <div className="flex items-center justify-between px-6 py-4  bg-white">
        <div className="text-sm text-gray-600">
          Total: {bookings.length} | Showing: {visible.length}
        </div>

        <div className="flex items-center gap-3">
          {/* Search by Booking ID */}
          <div className="relative">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Search by Booking ID…"
              className="border border-gray-300 rounded-lg text-sm px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-200 w-64"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
              />
            </svg>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <select
              className="border border-gray-300 rounded-lg text-sm px-3 py-1.5 focus:outline-none"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | BookingData["status"])
              }
            >
              <option value="all">All</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="">
        {/* Table */}
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
                {visible.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 break-all">
                      {b._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {b.userId?.name ?? "Unknown User"}
                      {b.userId?.email ? ` (${b.userId.email})` : ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {b.packageId?.name ?? "Unknown Package"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={b.status}
                        onChange={(e) =>
                          handleStatusChange(
                            b._id,
                            e.target.value as BookingData["status"]
                          )
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
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          b.packageId?._id &&
                          navigate(`/packages/${b.packageId._id}`)
                        }
                        className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                      >
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
                {visible.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      No bookings match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingTable;
