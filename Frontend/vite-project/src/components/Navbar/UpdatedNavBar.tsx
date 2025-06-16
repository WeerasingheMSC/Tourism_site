// src/components/AuthNavBar.tsx

import React, { useState } from "react";
import logo from "../../assets/logo.jpeg"; // same logo
import { Button, Dropdown, Drawer, Space } from "antd"; // add Avatar
import {
  DownOutlined,
  MenuOutlined,
  LogoutOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const AuthNavBar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false); // mobile drawer state
  const navigate = useNavigate(); // for navigation

  // --- Main menu links (same as in NavBar.tsx) ---
  const menuItems = [
    {
      label: (
        <span
          onClick={() => navigate("/")}
          className="cursor-pointer hover:text-orange-500"
        >
          Home
        </span>
      ),
      key: "home",
    },
    {
      label: (
        <span
          onClick={() => navigate("/packages")}
          className="cursor-pointer hover:text-orange-500"
        >
          Packages
        </span>
      ),
      key: "packages",
    },
    {
      label: (
        <span
          onClick={() => navigate("/CustomPackageForm")}
          className="cursor-pointer hover:text-orange-500"
        >
          Customize Package
        </span>
      ),
      key: "custom-package",
    },
  ];

  // --- Language switcher (same as before) ---
  const languageMenu = {
    items: [
      { label: "English", key: "1" },
      
    ],
  };

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // --- Profile dropdown menu: My Bookings & Logout ---
  const profileMenu = {
    items: [
      {
        key: "my-bookings",
        icon: <BookOutlined />,
        label: <span onClick={() => navigate("/booking")}>My Bookings</span>,
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: (
          <span
            onClick={() => {
              // TODO: your real logout logic here (e.g., clear tokens)
              localStorage.removeItem("authToken");
              localStorage.removeItem("user");
              navigate("/");
              window.location.reload();
            }}
          >
            Logout
          </span>
        ),
      },
    ],
  };

  return (
    <nav className="p-3 fixed top-0 left-0 w-full z-100 bg-white shadow-lg backgroun-transparent">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo & title (clickable) */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center cursor-pointer"
        >
          <img src={logo} alt="Logo" className="h-13 rounded-b-full pr-2" />
          <div className="text-blue-600 text-lg font-bold mt-1">
            Travel Booking Sri Lanka
          </div>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex lg:space-x-5 xl:space-x-20 md:space-x-2 items-center">
          {/* site links */}
          {menuItems.map((item) => (
            <li key={item.key} className="hover:text-orange-500">
              {item.label}
            </li>
          ))}

          {/* language switcher */}
          <li>
            <Dropdown menu={languageMenu} trigger={["click"]}>
              <Space>
                En <DownOutlined />
              </Space>
            </Dropdown>
          </li>

          {/* profile picture in a pure CSS rounded frame (no Avatar) */}
          <li className="ml-4">
            <Dropdown menu={profileMenu} trigger={["click"]}>
              {/* container ensures a perfect circle, with a light border */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-400 text-white text-lg font-semibold cursor-pointer border-2 border-blue-800">
                {user.name?.charAt(0).toUpperCase() || "?"}
              </div>
            </Dropdown>
          </li>
        </ul>

        {/* Mobile hamburger icon */}
        <div className="md:hidden flex">
          <Button
            className="mt-2"
            type="text"
            icon={
              <MenuOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            }
            onClick={() => setDrawerVisible(true)}
          />
        </div>

        {/* Mobile drawer */}
        <Drawer
          title={
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-10 rounded-b-full pr-2" />
              <span className="text-blue-600 text-lg font-bold">
                Travel Booking Sri Lanka
              </span>
            </div>
          }
          placement="right"
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <ul className="flex flex-col p-4 space-y-4">
            {/* site links */}
            {menuItems.map((item) => (
              <li key={item.key} className="hover:text-orange-500 text-lg">
                {item.label}
              </li>
            ))}

            {/* language chooser */}
            <li>
              <Dropdown menu={languageMenu} trigger={["click"]}>
                <Button block>Language</Button>
              </Dropdown>
            </li>

            {/* mobile: My Bookings */}
            <li>
              <Button
                block
                icon={<BookOutlined />}
                onClick={() => navigate("/booking")}
              >
                My Bookings
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
                  navigate("/");
                  window.location.reload();
                }}
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
