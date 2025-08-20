// src/pages/AdminDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const goToAddPackage = () => {
    // Redirect to your Add Packages form route
    navigate("/addpackage");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <p className="text-lg text-gray-600">Welcome to your Admin Dashboard!</p>
      <div className="mt-6">
        <button
          onClick={goToAddPackage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          Add Package
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
