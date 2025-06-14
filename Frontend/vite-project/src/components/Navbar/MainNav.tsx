// src/components/MainNav.tsx

import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";               // guest navbar
import UpdatedNavBar from "./UpdatedNavBar"; // logged-in navbar

const MainNav: React.FC = () => {
  // 1️⃣ Track auth state locally by checking localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken"))
  );

  // 2️⃣ Listen for storage events so if you log in/out in another tab,
  //    this component will re-render with the up-to-date value.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "authToken") {
        setIsAuthenticated(Boolean(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 3️⃣ Choose which navbar to render
  return isAuthenticated ? <UpdatedNavBar /> : <NavBar />;
};

export default MainNav;
