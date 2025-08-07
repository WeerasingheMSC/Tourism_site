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
}

interface Props {
  hotelId: string;
}

const HotelOwnerBookingTable: React.FC<Props> = ({ hotelId }) => {
  
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('fetching bookings for', hotelId)
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
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Booked On
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
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/owner/hotels/${hotelId}/bookings/${b._id}`
                        )
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
}
export default HotelOwnerBookingTable;
