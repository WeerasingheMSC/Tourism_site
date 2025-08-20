// src/components/hotelOwner/RegisterHotel.tsx
import React from 'react';

const RegisterHotel: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Register New Hotel</h1>
      <form className="space-y-4 bg-white rounded-2xl shadow p-6">
        <div>
          <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700">
            Hotel Name
          </label>
          <input
            type="text"
            id="hotelName"
            className="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sky-400 focus:outline-none"
            placeholder="Enter hotel name"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            className="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sky-400 focus:outline-none"
            placeholder="City, State"
          />
        </div>
        <div>
          <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
            Number of Rooms
          </label>
          <input
            type="number"
            id="rooms"
            className="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sky-400 focus:outline-none"
            placeholder="e.g. 50"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sky-400 focus:outline-none"
            placeholder="Brief description about your hotel"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-sky-400 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:-translate-y-1 transition duration-200"
          >
            Register Hotel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterHotel;
