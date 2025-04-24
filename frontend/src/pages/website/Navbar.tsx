// components/Navbar.tsx
import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { Button, Drawer, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const items: MenuProps['items'] = [
  { label: <Link to="/">Home</Link>, key: 'home' },
  { label: <Link to="/about">About</Link>, key: 'about' },
  { label: <Link to="/events">Events</Link>, key: 'events' },
  { label: <Link to="/contact">Contact</Link>, key: 'contact' },
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full flex justify-between items-center px-6 py-3 shadow-md bg-gradient-to-r from-[#1677ff] via-[#8248FF] to-[#6937CA]">
      <div className="text-xl font-bold text-white">Events</div>

      {/* Desktop Menu */}
      <div className="hidden md:flex">
        <Menu mode="horizontal" items={items} className="text-white bg-transparent border-none" theme="dark"/>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <Button type="text" icon={<MenuOutlined  className='text-white'/>} onClick={() => setOpen(true)} />
      </div>

      {/* Drawer Menu for Mobile */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <Menu mode="vertical" items={items} />
      </Drawer>
    </nav>
  );
};

export default Navbar;
