import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { FaLine, FaX, FaXmark } from "react-icons/fa6";
import { MdMenuBook } from "react-icons/md";
import { RiForward30Line } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-text shadow-lg sticky top-0 z-50 w-full">
     
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="text-2xl md:text-3xl font-extrabold tracking-tight italic"
          >
            SHIVVILON <span className="font-semibold text-sm">Solutions</span>
          </Link>
        </div>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 lg:gap-10 font-semibold text-lg">
            <li className="relative group">
              <Link to="/products" className="hover:text-red-200 transition">
                Products
              </Link>
              <div className="absolute top-full left-0 mt-2 w-56 bg-offwhite text-base-text rounded-md shadow-xl p-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 z-10 pointer-events-none group-hover:pointer-events-auto border border-gray-200">
                <Link
                  to="/products/control"
                  className="block hover:bg-gray-200 p-2 rounded transition"
                >
                  Control Technology
                </Link>
                <Link
                  to="/products/servo"
                  className="block hover:bg-gray-200 p-2 rounded transition"
                >
                  Servo Drives
                </Link>
              </div>
            </li>
            <li>
              <Link to="/solutions" className="hover:text-red-200 transition">
                Solutions
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-red-200 transition">
                About Us
              </Link>
            </li>
          </ul>
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <button
            className="p-2 rounded-full hover:bg-red-700 transition"
            aria-label="Search"
          >
            <span className="text-xl">🔍</span>
          </button>
          <button className="px-5 py-2.5 bg-red-800 text-sm font-bold rounded-full hover:bg-red-900 transition shadow-sm">
            CONTACT
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded focus:outline-none hover:bg-red-700 transition"
            aria-label="Toggle menu"
          >
            <span
              className={`inline-block text-2xl transition-transform duration-500 ease-in-out ${
                isMenuOpen ? "rotate-[180deg]" : "rotate-0"
              }`}
            >
              {isMenuOpen ? <FaXmark /> : <BiMenu />}
            </span>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className={`md:hidden absolute w-full left-0 shadow-xl bg-primary overflow-hidden transition-all duration-1000 ease-in-out ${
            isMenuOpen
              ? "max-h-[500px] opacity-100 "
              : "max-h-0 opacity-0 border-none"
          }`}
        >
          <nav className="px-4 pt-2 pb-4 space-y-2 border-t border-red-800">
            <Link
              to="/products"
              className="block px-3 py-2 font-semibold hover:bg-red-700 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>

            <Link
              to="/solutions"
              className="block px-3 py-2 font-semibold hover:bg-red-700 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Solutions
            </Link>

            <Link
              to="/about"
              className="block px-3 py-2 font-semibold hover:bg-red-700 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
