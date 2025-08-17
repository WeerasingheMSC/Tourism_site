// src/components/Booking/HotelOwnerBookingTable.tsx
import React, { useState, useEffect, type JSX } from "react";
import { getHotelBookings } from "../../api/hotelBooking";
import { useNavigate, useParams } from "react-router-dom";

interface HotelBooking {
  _id: string;
  roomType: string;
  startDate: string;
  endDate: string;
  numRooms: number;
  contactNumber: string;
  createdAt: string;
  totalPrice: number;
  currency: string;
  status: string;
}

interface Props {
  hotelId: string;
}
// map any approval status to your existing badge colors
const getApprovalBadgeColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "completed":
      return "bg-blue-200 text-gray-700";
    case "draft":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// turn "under_review" / "in-review" into "Under Review"
const formatStatusLabel = (status: string) =>
  (status || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const HotelOwnerBookingTable: React.FC<Props> = ({ hotelId }) => {
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("fetching bookings for", hotelId);
    if (!hotelId) return;
    getHotelBookings(hotelId)
      .then((data) => setBookings(data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [hotelId]);

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
                  Room Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  End Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  # Rooms
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Booked On
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tr-2xl">
                  Price
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
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalBadgeColor(
                        b.status
                      )}`}
                    >
                      {formatStatusLabel(b.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{b.totalPrice}$</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 text-center">
          <button
            onClick={() => navigate(`/owner/hotels/${hotelId}/bookings`)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            View all bookings
          </button>
        </div>
      </div>
    </div>
  );
};
export default HotelOwnerBookingTable;
