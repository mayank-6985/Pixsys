import React from "react";
import { FaSearch, FaBars } from "react-icons/fa";

const Header = ({ setIsSidebarOpen }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden text-gray-600 hover:text-[#da0e19] focus:outline-none"
        >
          <FaBars className="text-2xl" />
        </button>

        <img className="h-6 md:hidden" src="/Pixsys.png" alt="Pixsys Logo" />

        <div className="hidden md:flex relative w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-[#da0e19] focus:ring-1 focus:ring-[#da0e19] bg-gray-50 transition-colors"
            placeholder="Search products, news, or downloads..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 md:border-l md:pl-4 border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#da0e19] border border-[#da0e19] flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700">
            Admin User
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;