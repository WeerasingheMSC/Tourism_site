// src/components/Booking/HotelBookingTable.tsx
import { useState, useEffect, type JSX } from "react";
import { getMyBookings } from "../../api/hotelBooking";
import { useNavigate } from "react-router-dom";

interface HotelBooking {
  _id: string;
  hotelId: string;
  hotelName: string;
  roomType: string;
  startDate: string;
  endDate: string;
  numRooms: number;
  contactNumber: string;
  status: string;
  createdAt: string;
}
// badge colors for statuses
const getStatusColor = (status: string) => {
  switch (status) {
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

export default function HotelBookingTable(): JSX.Element {
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyBookings()
      .then((data) => setBookings(data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="my-8 text-center">Loading…</div>;
  if (error)
    return <div className="my-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto flex justify-center">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tl-2xl">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Hotel Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Room Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Start
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  End
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Rooms
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tr-2xl">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {b._id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {b.hotelName || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {b.roomType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(b.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(b.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {b.numRooms}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {b.contactNumber}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate(`/hotels/${b._id || ""}`)
                      }
                      className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                    >
                      {/* simple external-link icon */}
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
        <div className="px-6 py-4 border-t border-gray-100 text-center">
          <button
            onClick={() => navigate("/my-bookings")}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            View all bookings
          </button>
        </div>
      </div>
    </div>
  );
}
