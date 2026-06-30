import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import { FiShield, FiLogOut, FiX } from "react-icons/fi";
import { authService } from "../services/authService";

const Header = ({ setIsSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden text-zinc-600 hover:text-[#da0e19] focus:outline-none transition-colors"
        >
          <FaBars className="text-2xl" />
        </button>
        <img className="h-6 md:hidden" src="/Pixsys.png" alt="Pixsys Logo" />
      </div>

      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <div
          className="flex items-center space-x-2 md:border-l md:pl-4 border-zinc-200 cursor-pointer select-none group"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="w-8 h-8 rounded-full bg-[#da0e19] border border-[#da0e19] flex items-center justify-center text-white font-bold text-sm group-hover:bg-red-700 transition-colors shadow-sm">
            A
          </div>
          <span className="hidden md:block text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
            Admin User
          </span>
        </div>

        {isDropdownOpen && (
          <div className="absolute top-[120%] right-0 w-48 bg-white border border-zinc-200 shadow-xl rounded-lg overflow-hidden z-50 animate-fade-in-down py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-red-50 hover:text-[#da0e19] transition-colors font-bold tracking-wide text-left"
            >
              <FiLogOut size={16} />
              Sign Out
            </button>

            <div className="border-t border-zinc-100 my-1"></div>

            <button
              onClick={() => setIsDropdownOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors font-medium text-left"
            >
              <FiX size={16} />
              Cancel
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
