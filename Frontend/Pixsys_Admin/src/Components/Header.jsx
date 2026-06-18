import React from "react";
import { FaSearch } from "react-icons/fa";
import { RiSearch2Fill } from "react-icons/ri";

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <div className="flex items-center w-96">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-[#da0e19]-500 focus:ring-1 focus:ring-[#da0e19] bg-gray-50"
            placeholder="Search products, news, or downloads..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#da0e19] border border-[#da0e19] flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="text-sm font-medium text-gray-700">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
