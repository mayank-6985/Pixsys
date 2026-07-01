import React from "react";
import { FaDownload, FaHome, FaNewspaper, FaTimes } from "react-icons/fa";
import { AiFillProduct, AiOutlineSolution } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import {
  Contact,
  Contact2Icon,
  EarthIcon,
  icons,
  Map,
  MapIcon,
  MapMinusIcon,
  User,
} from "lucide-react";
import VisitorMap from "../Pages/VisitorMap";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navItems = [
    { name: "Home", url: "/", icon: <FaHome /> },
    { name: "Products", url: "/products", icon: <AiFillProduct /> },
    { name: "Solutions", url: "/solutions", icon: <AiOutlineSolution /> },
    { name: "News", url: "/news", icon: <FaNewspaper /> },
    { name: "Downloads", url: "/download", icon: <FaDownload /> },
    { name: "ConactQueries", url: "/conactQuery", icon: <Contact /> },
    { name: "VisitorsMap", url: "/visitor-map", icon: <Map /> },
    { name: "Users", url: "/users", icon: <User /> },
  ];

  const isActive = (url) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  };

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={closeSidebar}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col h-full z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-8 border-b border-gray-100 shrink-0">
          <img className="h-8" src="/Pixsys.png" alt="Pixsys Logo" />

          <button
            className="md:hidden text-gray-400 hover:text-[#da0e19] transition-colors"
            onClick={closeSidebar}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.url);

            return (
              <Link
                to={item.url}
                key={item.name}
                onClick={closeSidebar}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  active
                    ? "bg-[#da0e19] text-white font-semibold"
                    : "text-gray-600 hover:bg-red-50 hover:text-[#da0e19]"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
