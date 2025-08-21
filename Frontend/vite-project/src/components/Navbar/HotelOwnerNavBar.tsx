// src/components/AuthNavBar.tsx

import React, { useState } from "react";
import logo from "../../assets/logo.jpeg";
import { Button, Dropdown, Drawer, Space } from "antd";
import {
  DownOutlined,
  MenuOutlined,
  LogoutOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const AuthNavBar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a path is active
  const isActive = (path: string) => {
    if (path === '/hotel-owner-dashboard') {
      return location.pathname === '/hotel-owner-dashboard';
    }
    return location.pathname.startsWith(path);
  };


  const menuItems = [
    {
      label: (
        <span
          onClick={() => navigate("/hotel-owner-dashboard")}
          className={`cursor-pointer transition-all duration-300 font-medium ${
            isActive('/hotel-owner-dashboard') 
              ? 'text-orange-500 font-semibold border-b-2 border-orange-500 pb-1' 
              : 'text-gray-700 hover:text-orange-500 hover:font-medium'
          }`}
        >
          Home
        </span>
      ),
      key: "home",
      path: "/hotel-owner-dashboard",
    },
    {
      label: (
        <span
          onClick={() => navigate("/hotel-register")}
          className={`cursor-pointer transition-all duration-300 font-medium ${
            isActive('/hotel-register') 
              ? 'text-orange-500 font-semibold border-b-2 border-orange-500 pb-1' 
              : 'text-gray-700 hover:text-orange-500 hover:font-medium'
          }`}
        >
          Hotel Register
        </span>
      ),
      key: "packages",
      path: "/hotel-register",
    }
  ];

  // --- Language switcher (same as before) ---
  const languageMenu = {
    items: [
      { label: "English", key: "1" },
      
    ],
  };

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // --- Profile dropdown menu: Logout ---
  const profileMenu = {
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: (
          <span
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("user");
              navigate("/");
              window.location.reload();
            }}
            className="text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            Logout
          </span>
        ),
      },
    ],
  };

  return (
    <nav className="p-2 sm:p-3 fixed top-0 left-0 w-full z-50 bg-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-2 sm:px-4">
        {/* Logo & title (clickable) */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-300"
        >
          <img src={logo} alt="Logo" className="h-10 sm:h-12 lg:h-13 rounded-b-full pr-2" />
          <div className="text-blue-600 text-sm sm:text-lg lg:text-xl font-bold mt-1 hidden sm:block">
            Travel Booking Sri Lanka
          </div>
          <div className="text-blue-600 text-xs font-bold mt-1 sm:hidden">
            Travel SL
          </div>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex lg:space-x-6 xl:space-x-20 md:space-x-4 items-center">
          {/* site links */}
          {menuItems.map((item) => (
            <li key={item.key} className="py-2">
              {item.label}
            </li>
          ))}

          {/* language switcher */}
          <li>
            <Dropdown menu={languageMenu} trigger={["click"]}>
              <Space className="cursor-pointer hover:text-blue-600 transition-colors duration-200">
                En <DownOutlined />
              </Space>
            </Dropdown>
          </li>

          {/* profile picture with hotel owner styling */}
          <li className="ml-4">
            <Dropdown menu={profileMenu} trigger={["click"]}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500 text-white text-lg font-semibold cursor-pointer border-2 border-green-700 hover:bg-green-600 hover:border-green-800 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || "H"}
              </div>
            </Dropdown>
          </li>
        </ul>

        {/* Mobile hamburger icon */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile hotel owner profile avatar */}
          <Dropdown menu={profileMenu} trigger={["click"]}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white text-sm font-semibold cursor-pointer border-2 border-green-700 hover:bg-green-600 transition-all duration-200">
              {user?.name?.charAt(0).toUpperCase() || "H"}
            </div>
          </Dropdown>
          <Button
            type="text"
            icon={
              <MenuOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            }
            onClick={() => setDrawerVisible(true)}
            className="hover:bg-blue-50 transition-colors duration-200"
          />
        </div>

        {/* Mobile drawer */}
        <Drawer
          title={
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-8 rounded-b-full pr-2" />
              <span className="text-blue-600 text-base font-bold">
                Travel Booking Sri Lanka
              </span>
            </div>
          }
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
          width={280}
        >
          <ul className="flex flex-col p-4 space-y-3">
            {/* Hotel owner info header */}
            <li className="border-b border-gray-200 pb-3 mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 text-white text-lg font-semibold border-2 border-green-700">
                  {user?.name?.charAt(0).toUpperCase() || "H"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name || 'Hotel Owner'}</p>
                  <p className="text-sm text-green-600 font-medium">Hotel Partner</p>
                </div>
              </div>
            </li>

            {/* site links */}
            {menuItems.map((item) => (
              <li key={item.key} className="border-b border-gray-100 pb-3">
                <div 
                  onClick={() => {
                    if (item.key === 'home') navigate('/hotel-owner-dashboard');
                    else if (item.key === 'packages') navigate('/hotel-register');
                    setDrawerVisible(false);
                  }}
                  className={`text-base font-medium py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive(item.path || '') 
                      ? 'text-orange-500 bg-orange-50 border-l-4 border-orange-500' 
                      : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                  }`}
                >
                  {item.key === 'home' && 'Home'}
                  {item.key === 'packages' && 'Hotel Register'}
                </div>
              </li>
            ))}

            {/* language chooser */}
            <li className="pt-2">
              <Dropdown menu={languageMenu} trigger={["click"]}>
                <Button block size="large" className="hover:border-blue-500 transition-colors duration-200">
                  Language
                </Button>
              </Dropdown>
            </li>

            {/* mobile: Dashboard */}
            <li>
              <Button
                block
                icon={<BookOutlined />}
                onClick={() => {
                  navigate("/hotel-owner-dashboard");
                  setDrawerVisible(false);
                }}
                size="large"
                className="text-gray-700 hover:text-blue-600 hover:border-blue-400 transition-all duration-200"
              >
                Dashboard
              </Button>
            </li>

            {/* mobile: Logout */}
            <li>
              <Button
                block
                danger
                icon={<LogoutOutlined />}
                onClick={() => {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("user");
                  navigate("/");
                  window.location.reload();
                }}
                size="large"
                className="hover:bg-red-50 transition-all duration-200"
              >
                Logout
              </Button>
            </li>
          </ul>
        </Drawer>
      </div>
    </nav>
  );
};

export default AuthNavBar;
