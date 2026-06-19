import { useState } from "react";
import { BiMenu, BiSearch } from "react-icons/bi";
import { FaXmark } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { categories } from "../data/SolutionsPageData";
import { productMenu } from "../data/ProductsData";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubMenu = (menuKey) => {
    setExpandedMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white text-primary-text shadow-lg sticky top-0 z-[999] w-full">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight text-[#da0e19] italic focus:outline-none"
          >
            <img className="h-5 md:h-10" src="/Pixsys.png" alt="Pixsys Logo" />
          </Link>
        </div>

        <nav className="hidden lg:flex h-full">
          <ul className="flex items-center gap-10 font-medium text-[15px] h-full">
            <li className="h-full flex items-center">
              <Link
                to="/"
                className={`relative h-full flex items-center transition-colors ${
                  isActive("/")
                    ? "text-[#da0e19]"
                    : "hover:text-[#da0e19] text-gray-700"
                }`}
              >
                Home
                <div
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#da0e19] transition-transform duration-300 origin-center ${
                    isActive("/") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>

            <li className="group h-full flex items-center">
              <Link
                to="/products"
                className={`relative h-full flex items-center transition-colors ${
                  isActive("/products")
                    ? "text-[#da0e19]"
                    : "hover:text-[#da0e19] text-gray-700"
                }`}
              >
                Products
                <div
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#da0e19] transition-transform duration-300 origin-center ${
                    isActive("/products") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
              <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-5 gap-8">
                  {productMenu.map((column, idx) => (
                    <div key={idx}>
                      <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
                        {column.title}
                      </h3>
                      {column.sections.map((section, sIdx) => (
                        <div
                          key={sIdx}
                          className={
                            sIdx !== column.sections.length - 1 ? "mb-4" : ""
                          }
                        >
                          <h4 className="text-[#da0e19] font-medium mb-2">
                            {section.subtitle}
                          </h4>
                          <ul className="space-y-1">
                            {section.links.map((link, lIdx) => (
                              <li key={lIdx}>
                                <Link
                                  to={`/products?series=${link.path}`}
                                  className="text-sm text-gray-500 hover:text-[#da0e19] transition-colors inline-block py-1"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  - {link.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </li>

            <li className="group h-full flex items-center">
              <Link
                to="/solutions"
                className={`relative h-full flex items-center transition-colors ${
                  isActive("/solutions")
                    ? "text-[#da0e19]"
                    : "hover:text-[#da0e19] text-gray-700"
                }`}
              >
                Solutions
                <div
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#da0e19] transition-transform duration-300 origin-center ${
                    isActive("/solutions") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
              <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-3 flex justify-center gap-8 items-center">
                  <div className="flex flex-wrap justify-center gap-10 text-lg font-bold text-gray-900 p-3">
                    {categories
                      .filter((category) => category !== "All")
                      .map((category) => (
                        <Link
                          key={category}
                          to={`/solutions?category=${category}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <h3 className="hover:text-[#da0e19] transition-colors">
                            {category}
                          </h3>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </li>

            <li className="group h-full flex items-center">
              <Link
                to="/about"
                className={`relative h-full flex items-center transition-colors ${
                  isActive("/about")
                    ? "text-[#da0e19]"
                    : "hover:text-[#da0e19] text-gray-700"
                }`}
              >
                About Us
                <div
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#da0e19] transition-transform duration-300 origin-center ${
                    isActive("/about") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>

            <li className="group h-full flex items-center">
              <Link
                to="/news"
                className={`relative h-full flex items-center transition-colors ${
                  isActive("/news")
                    ? "text-[#da0e19]"
                    : "hover:text-[#da0e19] text-gray-700"
                }`}
              >
                News
                <div
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#da0e19] transition-transform duration-300 origin-center ${
                    isActive("/news") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>

            <li className="h-full flex items-center">
              <Link
                to="/download"
                className={`relative h-full flex items-center transition-colors ${
                  isActive("/download")
                    ? "text-[#da0e19]"
                    : "hover:text-[#da0e19] text-gray-700"
                }`}
              >
                Download
                <div
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#da0e19] transition-transform duration-300 origin-center ${
                    isActive("/download") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center text-gray-600 hover:text-[#da0e19] transition-colors sm:border-l sm:border-gray-200 sm:pl-6 h-full py-4">
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isMenuOpen) setIsMenuOpen(false);
              }}
              className="p-2 rounded focus:outline-none hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Toggle search"
            >
              {isSearchOpen ? <FaXmark size={22} /> : <BiSearch size={24} />}
            </button>
          </div>

          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (isSearchOpen) setIsSearchOpen(false);
            }}
            className="lg:hidden p-2 rounded focus:outline-none hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className={`inline-block text-2xl transition-transform duration-[800ms] ease-in-out ${
                isMenuOpen ? "rotate-[180deg]" : "rotate-0"
              }`}
            >
              {isMenuOpen ? <FaXmark /> : <BiMenu />}
            </span>
          </button>

          <div
            className={`absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 transition-all duration-300 z-50 ${
              isSearchOpen
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible -translate-y-2"
            }`}
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex justify-center items-center">
              <div className="flex text-lg text-gray-900 py-2 px-4 border border-slate-300 rounded-md items-center w-full max-w-2xl focus-within:border-[#da0e19] transition-colors">
                <input
                  className="outline-none font-light w-full pr-4 bg-transparent"
                  type="text"
                  placeholder="Search Keyword..."
                  autoFocus={isSearchOpen}
                />
                <button className="text-gray-400 hover:text-[#da0e19] transition-colors flex-shrink-0 cursor-pointer">
                  <BiSearch size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FULL SCREEN MENU */}
      <div
        className={`lg:hidden absolute w-full left-0 bg-white shadow-xl overflow-y-auto transition-all duration-[800ms] ease-in-out border-t border-gray-100 ${
          isMenuOpen ? "max-h-screen opacity-100 pb-10" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col w-full px-6">
          <div className="w-full">
            <div
              className="flex justify-between items-center py-4 border-b border-gray-200 cursor-pointer"
              onClick={() => toggleSubMenu("products")}
            >
              <span
                className={`font-bold text-[17px] ${isActive("/products") ? "text-[#da0e19]" : "text-gray-900"}`}
              >
                Products
              </span>
              {expandedMenus["products"] ? (
                <MdKeyboardArrowDown className="text-gray-400 text-xl" />
              ) : (
                <MdKeyboardArrowRight className="text-gray-400 text-xl" />
              )}
            </div>

            {expandedMenus["products"] && (
              <div className="w-full bg-gray-50/50">
                {productMenu.map((column, cIdx) => (
                  <div key={cIdx} className="w-full">
                    {/* Level 1: Main Category (e.g. Control Technology) */}
                    <div
                      className="flex justify-between items-center py-3 pl-4 border-b border-gray-100 cursor-pointer transition-colors"
                      onClick={() => toggleSubMenu(column.title)}
                    >
                      <span
                        className={`text-[15px] font-medium ${expandedMenus[column.title] ? "text-[#da0e19]" : "text-gray-700"}`}
                      >
                        {column.title}
                      </span>
                      {expandedMenus[column.title] ? (
                        <MdKeyboardArrowDown className="text-gray-400 text-xl" />
                      ) : (
                        <MdKeyboardArrowRight className="text-gray-400 text-xl" />
                      )}
                    </div>

                    {expandedMenus[column.title] && (
                      <div className="w-full bg-gray-50">
                        {column.sections.map((sec, sIdx) => (
                          <div key={sIdx} className="w-full">
                            {/* Level 2: Sub-category (e.g. PAC/IPC) */}
                            <div
                              className="flex justify-between items-center py-3 pl-8 border-b border-gray-100 cursor-pointer"
                              onClick={() => toggleSubMenu(sec.subtitle)}
                            >
                              <span
                                className={`text-[14px] ${expandedMenus[sec.subtitle] ? "text-[#da0e19]" : "text-gray-600"}`}
                              >
                                {sec.subtitle}
                              </span>
                              {expandedMenus[sec.subtitle] ? (
                                <MdKeyboardArrowDown className="text-gray-400 text-xl" />
                              ) : (
                                <MdKeyboardArrowRight className="text-gray-400 text-xl" />
                              )}
                            </div>

                            {/* Level 3: Final Links (e.g. Q Series) */}
                            {expandedMenus[sec.subtitle] && (
                              <div className="w-full bg-white">
                                {sec.links.map((link, lIdx) => (
                                  <Link
                                    key={lIdx}
                                    to={`/products?series=${link.path}`}
                                    className="block py-3 pl-12 border-b border-gray-50 text-[13px] text-gray-500 hover:text-[#da0e19] hover:bg-red-50/50 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    - {link.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/solutions"
            className="flex justify-between items-center py-4 border-b border-gray-200 cursor-pointer hover:text-[#da0e19] transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span
              className={`font-bold text-[17px] ${isActive("/solutions") ? "text-[#da0e19]" : "text-gray-900"}`}
            >
              Solutions
            </span>
            <MdKeyboardArrowRight className="text-gray-400 text-xl" />
          </Link>

          <Link
            to="/about"
            className="flex justify-between items-center py-4 border-b border-gray-200 cursor-pointer hover:text-[#da0e19] transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span
              className={`font-bold text-[17px] ${isActive("/about") ? "text-[#da0e19]" : "text-gray-900"}`}
            >
              About Us
            </span>
            <MdKeyboardArrowRight className="text-gray-400 text-xl" />
          </Link>

          <Link
            to="/news"
            className="flex justify-between items-center py-4 border-b border-gray-200 cursor-pointer hover:text-[#da0e19] transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span
              className={`font-bold text-[17px] ${isActive("/news") ? "text-[#da0e19]" : "text-gray-900"}`}
            >
              News
            </span>
            <MdKeyboardArrowRight className="text-gray-400 text-xl" />
          </Link>

          <Link
            to="/download"
            className="flex justify-between items-center py-4 border-b border-gray-200 cursor-pointer hover:text-[#da0e19] transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span
              className={`font-bold text-[17px] ${isActive("/download") ? "text-[#da0e19]" : "text-gray-900"}`}
            >
              Download
            </span>
            <MdKeyboardArrowRight className="text-gray-400 text-xl" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
