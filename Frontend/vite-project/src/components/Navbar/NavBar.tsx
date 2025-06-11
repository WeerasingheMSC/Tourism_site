import React, { useState } from 'react';
import logo from '../../assets/logo.jpeg';
import { Button, Dropdown, Drawer,Space } from 'antd';
import { DownOutlined, MenuOutlined } from '@ant-design/icons';

const NavBar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    { label: <a href="/">Destination</a>, key: 'destination' },
    { label: <a href="/about">Hotels</a>, key: 'hotels' },
    { label: <a href="/booking">Booking</a>, key: 'booking' },
    { label: <a href="/Travel">Travel</a>, key: 'travel' },
  ];

  const languageMenu = { 
    items: [
      { label: 'English', key: '1' },
      { label: 'Sinhala', key: '2' },
      { label: 'Tamil', key: '3' }, 
    ],
  };

  return (
    <nav className="p-3 fixed top-0 left-0 w-full z-50 bg-white shadow-lg backgroun-transparent">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-13 rounded-b-full pr-2" />
          <div className="text-blue-600 text-lg font-bold mt-1">Travel Booking Sri Lanka</div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex lg:space-x-5 xl:space-x-20 md:space-x-2 items-center">
          {menuItems.map(item => (
            <li key={item.key} className="hover:text-orange-500">
              {item.label}
            </li>
          ))}
          <li className='space-x-3'><a href="/login"><Button type='primary' style={{width:80}}>Login</Button></a>
          <a href="/register"><Button type='primary' style={{background:'#faad14'}}>Sign Up</Button></a></li>

          <li>
            <Dropdown menu={languageMenu} trigger={['click']}>
                <Space>
                    En <DownOutlined/>
                </Space>
            
            </Dropdown>
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
            <li>
              <Dropdown menu={languageMenu} trigger={['click']}>
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
