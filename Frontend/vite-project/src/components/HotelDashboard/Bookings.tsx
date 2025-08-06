// src/components/hotelOwner/Bookings.tsx
import React from 'react';

const Bookings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-sky-50">
              <th className="px-4 py-2 text-left text-gray-700">Booking ID</th>
              <th className="px-4 py-2 text-left text-gray-700">Guest Name</th>
              <th className="px-4 py-2 text-left text-gray-700">Check-in</th>
              <th className="px-4 py-2 text-left text-gray-700">Check-out</th>
              <th className="px-4 py-2 text-left text-gray-700">Status</th>
              <th className="px-4 py-2 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row; replace with dynamic data */}
            <tr className="border-t">
              <td className="px-4 py-3">#BKG12345</td>
              <td className="px-4 py-3">Alice Johnson</td>
              <td className="px-4 py-3">2025-06-15</td>
              <td className="px-4 py-3">2025-06-18</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">Confirmed</span>
              </td>
              <td className="px-4 py-3">
                <button className="text-sky-600 hover:text-blue-600">View</button>
              </td>
            </tr>
            {/* More rows... */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;