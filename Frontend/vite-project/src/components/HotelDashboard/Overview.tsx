// src/components/hotelOwner/Overview.tsx
import React from 'react';

const Overview: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-700">Total Hotels</h3>
          <p className="mt-4 text-3xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-700">Upcoming Bookings</h3>
          <p className="mt-4 text-3xl font-bold text-gray-900">8</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-xl font-semibold text-gray-700">Revenue This Month</h3>
          <p className="mt-4 text-3xl font-bold text-gray-900">$12,450</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
