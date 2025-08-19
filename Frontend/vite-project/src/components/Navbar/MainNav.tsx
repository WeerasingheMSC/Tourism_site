// src/components/MainNav.tsx
import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";                   // guest
import TouristNavBar from "./UpdatedNavBar";     // role="tourist"
import HotelOwnerNavBar from "./HotelOwnerNavBar"; // role="hotel-owner"
import AdminNavBar from "./AdminNavBar";         // role="admin"
import VehicleOwnerNavBar from "./VehicleOwnerNavBar"; // role="vehicle-owner"

function getRoleFromToken(token: string): string | null {
  try {
    // JWT format is header.payload.signature
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.role || null;
  } catch {
    return null;
  }
}

const MainNav: React.FC = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [role, setRole] = useState<string | null>(() =>
    token ? getRoleFromToken(token) : null
  );

  // Listen for token changes in other tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "authToken") {
        setToken(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Whenever token changes (login / logout), decode the role
  useEffect(() => {
    if (token) {
      setRole(getRoleFromToken(token));
    } else {
      setRole(null);
    }
  }, [token]);

  // Render based on role
  if (!token) {
    return <NavBar />;
  }

  switch (role) {
    case "tourist":
      return <TouristNavBar />;
    case "hotel-owner":
      return <HotelOwnerNavBar />;
    case "admin":
      return <AdminNavBar />;
    case "transport-owner":
      return <VehicleOwnerNavBar />;
    default:
      // token exists but no role or unrecognized role
      return <NavBar />;
  }
};

export default MainNav;
