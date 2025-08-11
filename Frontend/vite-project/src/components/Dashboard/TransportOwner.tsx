import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Overview from "../../components/VehicleDashboard/Overview";
import RegisterVehicle from "../../components/VehicleDashboard/RegisterVehicle";
import Bookings from "../../components/VehicleDashboard/Bookings";
import Profile from "../../components/VehicleDashboard/Profile";
import VehicleOwnerDetails from "../../components/VehicleDashboard/VehicleOwnerDetails";

type Section = "overview" | "registerVehicle" | "bookings" | "profile" | "vehicleOwnerDetails";

const TransportOwner = () => {
  const [section, setSection] = useState<Section>("overview");
  const navigate = useNavigate();

  const handleDashboardNavigation = () => {
    navigate("/vehicle-partner-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800">Vehicle Dashboard</h2>
            <p className="text-sm text-gray-600">Manage your fleet</p>
          </div>
          
          <nav className="mt-6">
            <button
              onClick={handleDashboardNavigation}
              className="w-full flex items-center px-6 py-3 text-left transition-colors duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </button>
            
            <button
              onClick={() => setSection("overview")}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                section === "overview"
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
              </svg>
              Overview
            </button>
            
            <button
              onClick={() => setSection("registerVehicle")}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                section === "registerVehicle"
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Register Vehicle
            </button>
            
            <button
              onClick={() => setSection("bookings")}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                section === "bookings"
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Bookings
            </button>
            
            <button
              onClick={() => setSection("profile")}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                section === "profile"
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
            
            <button
              onClick={() => setSection("vehicleOwnerDetails")}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200 ${
                section === "vehicleOwnerDetails"
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Vehicle Owner Details
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {section === "overview" && <Overview />}
          {section === "registerVehicle" && <RegisterVehicle />}
          {section === "bookings" && <Bookings />}
          {section === "profile" && <Profile />}
          {section === "vehicleOwnerDetails" && <VehicleOwnerDetails />}
        </div>
      </div>
    </div>
  );
};

export default TransportOwner;