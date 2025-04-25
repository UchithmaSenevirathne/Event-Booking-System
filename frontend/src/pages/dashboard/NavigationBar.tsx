import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ADMIN_NAVBAR_LINKS, USER_NAVBAR_LINKS } from "../../components/Navigation";
import { Button, Drawer } from "antd"; // Import Drawer
import { toast } from "react-toastify";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons"; // Icons for Hamburger Menu
import classNames from "classnames";

type NavigationBarProps = {
  role: string;
};

export default function NavigationBar({ role }: NavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for Drawer
  const [isDrawerVisible, setIsDrawerVisible] = useState(false); // Drawer visibility state
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const linksToRender =
    role === "ADMIN" ? ADMIN_NAVBAR_LINKS : USER_NAVBAR_LINKS;

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out!");
    navigate("/login");
  };

  const showDrawer = () => {
    setIsDrawerVisible(true); // Show Drawer
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false); // Close Drawer
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#1677ff] via-[#8248FF] to-[#6937CA] shadow-sm">
      <h1 className="text-lg font-extrabold text-white">Events</h1>

      {/* Mobile Hamburger Menu Button */}
      <div className="lg:hidden">
        <Button
          type="text"
          onClick={showDrawer}
          icon={<MenuOutlined className="text-white" />}
        />
      </div>

      {/* Right Side (Logout and Welcome Text) */}
      <div className="items-center hidden gap-4 lg:flex">
        <span className="font-semibold text-white">Welcome !</span>
        <Button onClick={handleLogout} type="primary" className="px-3 py-2">
          Logout
        </Button>
      </div>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        placement="right"
        closable={false}
        onClose={closeDrawer}
        visible={isDrawerVisible}
        key="drawer"
        width={250}
        bodyStyle={{ backgroundColor: "#1E1E1E"}} 
      >
        <div className="flex flex-col items-star">
          {linksToRender.map((item) => (
            <NavbarLink key={item.key} item={item} currentPath={pathname} />
          ))}
          <Button
            type="primary"
            onClick={handleLogout}
            className="w-full mt-4"
          >
            Logout
          </Button>
        </div>
      </Drawer>
    </nav>
  );
}

type NavbarLinkProps = {
  item: { key: string; label: string; path: string };
  currentPath: string;
};

function NavbarLink({ item, currentPath }: NavbarLinkProps) {
  const isActive = currentPath === `/layout${item.path}`;

  return (
    <Link
      to={`/layout${item.path}`}
      className={classNames(
        "flex items-center gap-2 font-normal rounded-md text-base transition-all duration-500 no-underline hover:no-underline px-3 py-2",
        isActive ? "text-white underline" : "text-white"
      )}
    >
      {item.label}
    </Link>
  );
}
