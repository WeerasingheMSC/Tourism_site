import React, { useState } from 'react';
import logo from '../../assets/logo.jpeg';
import { Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const NavBarUpdated = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    { label: <a href="/">Customize your plan</a>, key: 'destination' },
    { label: <a href="/about">Add package</a>, key: 'hotels' },
  ];

  return (
    <nav className="p-3 fixed top-0 left-0 w-full z-50 bg-transparent">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-13 rounded-b-full pr-2" />
          <div className="text-blue-600 text-lg font-bold mt-1">Travel Booking Sri Lanka</div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex lg:space-x-5 xl:space-x-10 md:space-x-2 items-center text-white">
          {menuItems.map(item => (
            <li key={item.key} className="hover:text-orange-500">
              {item.label}
            </li>
          ))}
          {/* Profile Picture */}
          <li>
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              className="w-15 h-15 rounded-full object-cover border-2 border-blue-400"
            />
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <div className='md:hidden flex'>
        <Button
            className="flex md:hidden mt-2"
            type="text"
            icon={<MenuOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
            onClick={() => setDrawerVisible(true)}
        />
        </div>
        {/* Mobile Drawer Menu */}
        <Drawer
          title={
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-10 rounded-b-full pr-2" />
              <span className="text-blue-600 text-lg font-bold">Travel Booking Sri Lanka</span>
            </div>
          }
          placement="right"
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <ul className="flex flex-col p-4 space-y-4">
            {menuItems.map(item => (
              <li key={item.key} className="hover:text- text-lg">
                {item.label}
              </li>
            ))}
          </ul>
        </Drawer>
      </div>
    </nav>
  );
};

export default NavBarUpdated;
