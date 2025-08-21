import { useState } from "react";
import logo from "../../assets/logo.jpeg";
import { Button, Dropdown, Drawer, Space } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if a path is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

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
          className={`cursor-pointer transition-all duration-300 font-medium ${
            isActive('/') 
              ? 'text-orange-500 font-semibold border-b-2 border-orange-500 pb-1' 
              : 'text-gray-700 hover:text-orange-500 hover:font-medium'
          }`}
        >
          Home
        </span>
      ),
      key: "home",
      path: "/",
    },
    {
      label: (
        <span
          onClick={() => navigate("/packages")}
          className={`cursor-pointer transition-all duration-300 font-medium ${
            isActive('/packages') 
              ? 'text-orange-500 font-semibold border-b-2 border-orange-500 pb-1' 
              : 'text-gray-700 hover:text-orange-500 hover:font-medium'
          }`}
        >
          Packages
        </span>
      ),
      key: "packages",
      path: "/packages",
    },
    {
      label: (
        <span
          onClick={handleCustomizeClick}
          className={`cursor-pointer transition-all duration-300 font-medium ${
            isActive('/CustomPackageForm') 
              ? 'text-orange-500 font-semibold border-b-2 border-orange-500 pb-1' 
              : 'text-gray-700 hover:text-orange-500 hover:font-medium'
          }`}
        >
          Customize Package
        </span>
      ),
      key: "custom-package",
      path: "/CustomPackageForm",
    },
    {
      label: (
        <span
          onClick={() => navigate("/hotels")}
          className={`cursor-pointer transition-all duration-300 font-medium ${
            isActive('/hotels') 
              ? 'text-orange-500 font-semibold border-b-2 border-orange-500 pb-1' 
              : 'text-gray-700 hover:text-orange-500 hover:font-medium'
          }`}
        >
          Hotels
        </span>
      ),
      key: "hotels",
      path: "/hotels",
    },
    {
      label: (
        <span
          onClick={() => navigate("/vehicles")}
          className={`cursor-pointer transition-all duration-300 font-medium ${
            isActive('/vehicles') 
              ? 'text-orange-500 font-semibold border-b-2 border-orange-500 pb-1' 
              : 'text-gray-700 hover:text-orange-500 hover:font-medium'
          }`}
        >
          Vehicles
        </span>
      ),
      key: "vehicles",
      path: "/vehicles",
    },
  ];

  const languageMenu = {
    items: [
      { label: "English", key: "1" },
      
    ],
  };

  return (
    <nav className="z-50 p-2 sm:p-3 fixed top-0 left-0 w-full bg-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-2 sm:px-4">
        {/* Logo and Title */}
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

        {/* Desktop Menu */}
        <ul className="hidden md:flex lg:space-x-6 xl:space-x-10 md:space-x-4 items-center">
          {menuItems.map((item) => (
            <li key={item.key} className="py-2">
              {item.label}
            </li>
          ))}
          <li className="flex space-x-2 lg:space-x-3">
            <Button 
              onClick={() => navigate("/login")}
              type="primary" 
              size="small"
              className="hover:scale-105 transition-transform duration-200"
              style={{ minWidth: 70 }}>
              Login
            </Button>
            <Button 
              onClick={() => navigate("/signup")}
              type="primary" 
              size="small"
              className="hover:scale-105 transition-transform duration-200"
              style={{ background: "#faad14", borderColor: "#faad14" }}>
              Sign Up
            </Button>
          </li>

          <li>
            <Dropdown menu={languageMenu} trigger={["click"]}>
              <Space className="cursor-pointer hover:text-blue-600 transition-colors duration-200">
                En <DownOutlined />
              </Space>
            </Dropdown>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center space-x-2">
          <Button
            type="text"
            icon={
              <MenuOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            }
            onClick={() => setDrawerVisible(true)}
            className="hover:bg-blue-50 transition-colors duration-200"
          />
        </div>
        {/* Mobile Drawer Menu */}
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
            {menuItems.map((item) => (
              <li key={item.key} className="border-b border-gray-100 pb-3">
                <div 
                  onClick={() => {
                    if (item.key === 'home') navigate('/');
                    else if (item.key === 'packages') navigate('/packages');
                    else if (item.key === 'custom-package') handleCustomizeClick();
                    else if (item.key === 'hotels') navigate('/hotels');
                    else if (item.key === 'vehicles') navigate('/vehicles');
                    setDrawerVisible(false);
                  }}
                  className={`text-base font-medium py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive(item.path || '') 
                      ? 'text-orange-500 bg-orange-50 border-l-4 border-orange-500' 
                      : 'text-gray-700 hover:text-orange-500 hover:bg-gray-50'
                  }`}
                >
                  {item.key === 'home' && 'Home'}
                  {item.key === 'packages' && 'Packages'}
                  {item.key === 'custom-package' && 'Customize Package'}
                  {item.key === 'hotels' && 'Hotels'}
                  {item.key === 'vehicles' && 'Vehicles'}
                </div>
              </li>
            ))}
            <li className="pt-2">
              <Button 
                onClick={() => {
                  navigate("/login");
                  setDrawerVisible(false);
                }}
                type="primary" 
                block
                size="large"
                className="mb-3 hover:scale-105 transition-transform duration-200"
              >
                Login
              </Button>
            </li>
            <li>
              <Button 
                onClick={() => {
                  navigate("/signup");
                  setDrawerVisible(false);
                }}
                type="primary" 
                block
                size="large"
                style={{ background: "#faad14", borderColor: "#faad14" }}
                className="hover:scale-105 transition-transform duration-200"
              >
                Sign Up
              </Button>
            </li>
            <li className="pt-2">
              <Dropdown menu={languageMenu} trigger={["click"]}>
                <Button block size="large" className="hover:border-blue-500 transition-colors duration-200">
                  Language
                </Button>
              </Dropdown>
            </li>
          </ul>
        </Drawer>
      </div>
    </nav>
  );
};

export default NavBar;