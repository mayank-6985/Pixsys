import React from "react";
import { FaDownload, FaHome, FaNewspaper } from "react-icons/fa";
import { AiFillProduct, AiOutlineSolution } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", url: "/", icon: <FaHome /> },
    { name: "Products", url: "/products", icon: <AiFillProduct /> },
    { name: "Solutions", url: "/solutions", icon: <AiOutlineSolution /> },
    { name: "News", url: "/news", icon: <FaNewspaper /> },
    { name: "Downloads", url: "/download", icon: <FaDownload /> },
  ];

  const isActive = (url) => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="h-16 flex items-center px-8 border-b border-gray-100">
        <img className="h-8" src="/Pixsys.png" alt="Pixsys Logo" />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const active = isActive(item.url);

          return (
            <Link
              to={item.url}
              key={item.name}
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
  );
};

export default Sidebar;
