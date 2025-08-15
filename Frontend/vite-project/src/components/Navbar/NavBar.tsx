import { useState } from "react";
import logo from "../../assets/logo.jpeg";
import { Button, Dropdown, Drawer, Space } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate(); // Hook for navigation

  // 👇 guard for Customize Package: if not logged in, go to /login
  const handleCustomizeClick = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/CustomPackageForm");
    } else {
      navigate("/login");
    }
  };
  const [drawerVisible, setDrawerVisible] = useState(false);
  // Hook for navigation
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
          onClick={handleCustomizeClick}
          className="cursor-pointer hover:text-orange-500"
        >
          Customize Package
        </span>
      ),
      key: "custom-package",
    },
    {
      label: (
        <span
          onClick={() => navigate("/hotels")}
          className="cursor-pointer hover:text-orange-500"
        >
          Hotels
        </span>
      ),
      key: "hotels",
    },
    {
      label: (
        <span
          onClick={() => navigate("/vehicles")}
          className="cursor-pointer hover:text-orange-500"
        >
          Vehicles
        </span>
      ),
      key: "hotels",
    },
  ];

  const languageMenu = {
    items: [
      { label: "English", key: "1" },
      
    ],
  };

  return (
    <nav className="z-100 p-3 fixed top-0 left-0 w-full  bg-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div
          onClick={() => navigate("/")} // Redirect to home on click
          className="flex items-center cursor-pointer"
        >
          <img src={logo} alt="Logo" className="h-13 rounded-b-full pr-2" />
          <div className="text-blue-600 text-lg font-bold mt-1">
            Travel Booking Sri Lanka
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex lg:space-x-2 xl:space-x-10 md:space-x-2 items-center">
          {menuItems.map((item) => (
            <li key={item.key} className="hover:text-orange-500">
              {item.label}
            </li>
          ))}
          <li className="space-x-3">
            
              <Button 
                onClick={() => navigate("/login")}
                type="primary" style={{ width: 80 }}>
                Login
              </Button>
            
            
              <Button 
                onClick={() => navigate("/signup")}
                type="primary" style={{ background: "#faad14" }}>
                Sign Up
              </Button>
            
          </li>

          <li>
            <Dropdown menu={languageMenu} trigger={["click"]}>
              <Space>
                En <DownOutlined />
              </Space>
            </Dropdown>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex">
          <Button
            className="flex md:hidden mt-2"
            type="text"
            icon={
              <MenuOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
            }
            onClick={() => setDrawerVisible(true)}
          />
        </div>
        {/* Mobile Drawer Menu */}
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
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}
        >
          <ul className="flex flex-col p-4 space-y-4">
            {menuItems.map((item) => (
              <li key={item.key} className="hover:text- text-lg">
                {item.label}
              </li>
            ))}
            <li>
              <Button 
                onClick={() => navigate("/login")}
                type="primary" 
                block
                style={{ marginBottom: 8 }}>
                Login
              </Button>
            </li>
            <li>
              <Button 
                onClick={() => navigate("/register")}
                type="primary" 
                block
                style={{ background: "#faad14" }}>
                Sign Up
              </Button>
            </li>
            <li>
              <Dropdown menu={languageMenu} trigger={["click"]}>
                <Button block>Language</Button>
              </Dropdown>
            </li>
          </ul>
        </Drawer>
      </div>
    </nav>
  );
};

export default NavBar;