// src/pages/HotelOwnerDashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1) Import each section component
import Overview from "../../components/HotelDashboard/Overview";
import RegisterHotel from "../../components/HotelDashboard/RegisterHotel";
import Bookings from "../../components/HotelDashboard/Bookings";
import Profile from "../../components/HotelDashboard/Profile";

type Section = "overview" | "registerHotel" | "bookings" | "profile";

const HotelOwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");
  const [userName, setUserName] = useState<string>(""); // store user name
  const [userAvatar, setUserAvatar] = useState<string>(""); // store avatar URL if available

  // 2) Dynamic user role check + extract name
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    try {
      const userObj = JSON.parse(stored) as {
        id: string;
        name: string;
        email: string;
        role: string;
        avatarUrl?: string;
      };
      if (userObj.role !== "hotel-owner") {
        navigate("/login");
        return;
      }
      setUserName(userObj.name);
      // If your user object has an avatarUrl field, use it; otherwise fallback to a placeholder
      setUserAvatar(userObj.avatarUrl || "/placeholder-avatar.png");
    } catch (e) {
      console.error("Failed to parse stored user:", e);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Profile at top */}
        <div className="p-6 bg-gradient-to-br from-sky-100 to-blue-160 text-black flex flex-col items-center border-b-2 border-gray-200">
          <img
            src={userAvatar}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-blue-400 mb-4 object-cover"
          />
          <h2 className="text-xl font-semibold">{userName}</h2>
          <button
            onClick={handleLogout}
            className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition duration-200 text-sm"
          >
            Logout
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setSection("overview")}
                className={`w-full text-left px-6 py-3 hover:bg-sky-100 transition ${
                  section === "overview"
                    ? "bg-sky-50 font-semibold"
                    : "text-gray-700"
                }`}
              >
                Dashboard Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => setSection("registerHotel")}
                className={`w-full text-left px-6 py-3 hover:bg-sky-100 transition ${
                  section === "registerHotel"
                    ? "bg-sky-50 font-semibold"
                    : "text-gray-700"
                }`}
              >
                Register New Hotel
              </button>
            </li>
            <li>
              <button
                onClick={() => setSection("bookings")}
                className={`w-full text-left px-6 py-3 hover:bg-sky-100 transition ${
                  section === "bookings"
                    ? "bg-sky-50 font-semibold"
                    : "text-gray-700"
                }`}
              >
                View Bookings
              </button>
            </li>
            <li>
              <button
                onClick={() => setSection("profile")}
                className={`w-full text-left px-6 py-3 hover:bg-sky-100 transition ${
                  section === "profile"
                    ? "bg-sky-50 font-semibold"
                    : "text-gray-700"
                }`}
              >
                Manage Profile
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {section === "overview" && <Overview />}
        {section === "registerHotel" && <RegisterHotel />}
        {section === "bookings" && <Bookings />}
        {section === "profile" && <Profile />}
      </main>
    </div>
  );
};

export default HotelOwnerDashboard;
