import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  // State to manage the open/closed status of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-text shadow-lg sticky top-0 z-50 w-full">
      
      {/* MOBILE FIRST CONTAINER: 
        Default is px-4 and h-16 for mobile. 
        Scales to px-6 and h-20 on md (tablet) and larger. 
      */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">

        {/* 1. Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight">
            HCFA <span className="font-light">GLOBAL</span>
          </Link>
        </div>

        {/* 2. Desktop Navigation (Hidden on Mobile, block on md+) */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 lg:gap-10 font-semibold text-lg">
            
            <li className="relative group">
              <Link to="/products" className="hover:text-red-200 transition">Products</Link>
              {/* Desktop Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-56 bg-offwhite text-base-text rounded-md shadow-xl p-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300 z-10 pointer-events-none group-hover:pointer-events-auto border border-gray-200">
                 <Link to="/products/control" className="block hover:bg-gray-200 p-2 rounded transition">Control Technology</Link>
                 <Link to="/products/servo" className="block hover:bg-gray-200 p-2 rounded transition">Servo Drives</Link>
              </div>
            </li>
            <li><Link to="/solutions" className="hover:text-red-200 transition">Solutions</Link></li>
            <li><Link to="/about" className="hover:text-red-200 transition">About Us</Link></li>
          </ul>
        </nav>

        {/* 3. Desktop Secondary Elements (Hidden on Mobile, flex on md+) */}
        <div className="hidden md:flex items-center gap-5">
          <button className="p-2 rounded-full hover:bg-red-700 transition" aria-label="Search">
             <span className="text-xl">🔍</span>
          </button>
          <button className="px-5 py-2.5 bg-red-800 text-sm font-bold rounded-full hover:bg-red-900 transition shadow-sm">
            CONTACT
          </button>
        </div>

        {/* 4. Mobile Hamburger Button (Visible ONLY on Mobile) */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded focus:outline-none hover:bg-red-700 transition"
            aria-label="Toggle menu"
          >
            {/* Toggles between a hamburger icon and an X */}
            <span className="text-2xl">{isMenuOpen ? "✖" : "☰"}</span>
          </button>
        </div>

      </div>

      {/* 5. Mobile Dropdown Menu Panel */}
      {/* Renders conditionally if isMenuOpen is true */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary border-t border-red-800 absolute w-full left-0 shadow-xl">
          <nav className="px-4 pt-2 pb-4 space-y-2">
            {/* Added onClick handlers to close the menu when a user clicks a link */}
            <Link to="/products" className="block px-3 py-2 font-semibold hover:bg-red-700 rounded transition" onClick={() => setIsMenuOpen(false)}>Products</Link>
            <Link to="/solutions" className="block px-3 py-2 font-semibold hover:bg-red-700 rounded transition" onClick={() => setIsMenuOpen(false)}>Solutions</Link>
            <Link to="/about" className="block px-3 py-2 font-semibold hover:bg-red-700 rounded transition" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            
            {/* Mobile Secondary Elements */}
            <div className="pt-4 mt-2 border-t border-red-800 flex justify-between items-center px-3">
               <button className="p-2 rounded-full hover:bg-red-700 transition" aria-label="Search">
                  <span className="text-xl">🔍</span>
               </button>
               <button className="px-5 py-2 bg-red-800 text-sm font-bold rounded hover:bg-red-900 transition shadow-sm">
                 CONTACT
               </button>
            </div>
          </nav>
        </div>
      )}

    </header>
  );
}