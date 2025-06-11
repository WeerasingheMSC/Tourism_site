// src/components/hotelOwner/Profile.tsx
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manage Profile</h1>
      <form className="space-y-4 bg-white rounded-2xl shadow p-6 max-w-lg">
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
            Owner Name
          </label>
          <input
            type="text"
            id="ownerName"
            className="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sky-400 focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sky-400 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            className="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sky-400 focus:outline-none"
            placeholder="123-456-7890"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-sky-400 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:-translate-y-1 transition duration-200"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
