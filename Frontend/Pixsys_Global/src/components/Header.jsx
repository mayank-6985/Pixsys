import { useState, useEffect, useRef } from "react";
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState({});
  const circleRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollTop;
          const windowHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

          const scrollPercentage = totalScroll / windowHeight;

          setScrollProgress(scrollPercentage * 100);

          if (circleRef.current) {
            const offset = 88 - 88 * scrollPercentage;
            circleRef.current.style.strokeDashoffset = offset;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
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
    <header className="bg-white text-zinc-900 border-b border-zinc-200 sticky top-0 z-[999] w-full">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link to="/" className="focus:outline-none block">
            <img className="h-6 md:h-10" src="/Pixsys.png" alt="Pixsys Logo" />
          </Link>
        </div>

        <nav className="hidden lg:flex h-full">
          <ul className="flex items-center gap-10 text-sm font-bold uppercase tracking-wider h-full">
            <li className="h-full flex items-center">
              <Link
                to="/"
                className={`relative h-full flex items-center transition-colors ${
                  isActive("/")
                    ? "text-[#da0e19]"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Home
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#da0e19] transition-transform duration-300 origin-left ${
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
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Products
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#da0e19] transition-transform duration-300 origin-left ${
                    isActive("/products") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>

              <div className="absolute top-full left-0 w-full bg-[#f8f9fa] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-5 gap-8">
                  {productMenu.map((column, idx) => (
                    <div
                      key={idx}
                      className="border-l border-zinc-200 pl-6 first:border-0 first:pl-0"
                    >
                      <Link
                        to={`/products?category=${column.title}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="inline-block text-xl font-mono font-bold text-zinc-950 hover:text-[#da0e19] uppercase tracking-widest mb-6 transition-colors"
                      >
                        {column.title}
                      </Link>
                      {column.sections.map((section, sIdx) => (
                        <div
                          key={sIdx}
                          className={
                            sIdx !== column.sections.length - 1 ? "mb-6" : ""
                          }
                        >
                          <Link
                            to={`/products?series=${section.links[0]?.path}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="inline-block text-zinc-900 hover:text-[#da0e19] font-bold uppercase text-sm mb-3 transition-colors"
                          >
                            {section.subtitle}
                          </Link>
                          <ul className="space-y-2">
                            {section.links.map((link, lIdx) => (
                              <li key={lIdx}>
                                <Link
                                  to={`/products?series=${link.path}`}
                                  className="group/link flex items-center gap-2 text-sm text-zinc-500 hover:text-[#da0e19] transition-colors font-medium capitalize w-fit"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <div className="w-1.5 h-1.5 bg-[#da0e19] opacity-0 group-hover/link:opacity-100 transition-opacity"></div>
                                  <span className="-ml-3 group-hover/link:ml-0 transition-all duration-300">
                                    {link.name}
                                  </span>
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
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Solutions
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#da0e19] transition-transform duration-300 origin-left ${
                    isActive("/solutions") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
              <div className="absolute top-full left-0 w-full bg-[#f8f9fa] border-b-4 border-zinc-900 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-8 flex justify-center gap-8 items-center">
                  <div className="flex flex-wrap justify-center gap-12 text-sm font-bold text-zinc-900 p-3">
                    {categories
                      .filter((category) => category !== "All")
                      .map((category) => (
                        <Link
                          key={category}
                          to={`/solutions?category=${category}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="group/link flex items-center gap-2 hover:text-[#da0e19] transition-colors"
                        >
                          <div className="w-1.5 h-1.5 bg-[#da0e19] opacity-0 group-hover/link:opacity-100 transition-opacity"></div>
                          <span className="uppercase tracking-widest">
                            {category}
                          </span>
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
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                About Us
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#da0e19] transition-transform duration-300 origin-left ${
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
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                News
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#da0e19] transition-transform duration-300 origin-left ${
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
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Download
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-[#da0e19] transition-transform duration-300 origin-left ${
                    isActive("/download") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-6 h-full">
          <div className="hidden sm:block w-[1px] h-8 bg-zinc-200"></div>

          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isMenuOpen) setIsMenuOpen(false);
            }}
            className="p-2 text-zinc-900 hover:text-[#da0e19] transition-colors cursor-pointer"
            aria-label="Toggle search"
          >
            {isSearchOpen ? <FaXmark size={24} /> : <BiSearch size={24} />}
          </button>
          <div className="hidden lg:flex items-center justify-center w-8 h-8 relative ml-2">
            <svg className="w-full h-full transform -rotate-90 overflow-visible">
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                className="text-zinc-200"
              />
              <circle
                ref={circleRef}
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                strokeWidth="2"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray="88"
                strokeDashoffset="88"
                className="text-[#da0e19]"
              />
            </svg>
          </div>

          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (isSearchOpen) setIsSearchOpen(false);
            }}
            className="lg:hidden p-2 text-zinc-900 transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className={`inline-block text-2xl transition-transform duration-300 ${isMenuOpen ? "rotate-90" : "rotate-0"}`}
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

      <div
        className={`lg:hidden absolute w-full left-0 bg-white shadow-2xl overflow-y-auto transition-all duration-[500ms] ease-in-out border-b-4 border-zinc-900 ${
          isMenuOpen ? "max-h-[85vh] opacity-100 pb-10" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col w-full">
          <div className="w-full border-b border-zinc-200">
            <div
              className="flex justify-between items-center py-5 px-6 cursor-pointer hover:bg-zinc-50"
              onClick={() => toggleSubMenu("products")}
            >
              <span
                className={`font-bold text-sm uppercase tracking-wider ${isActive("/products") ? "text-[#da0e19]" : "text-zinc-900"}`}
              >
                Products
              </span>
              <span className="text-zinc-400">
                {expandedMenus["products"] ? (
                  <FaXmark />
                ) : (
                  <MdKeyboardArrowDown className="text-xl" />
                )}
              </span>
            </div>

            {expandedMenus["products"] && (
              <div className="w-full bg-[#f8f9fa] border-t border-zinc-200">
                {productMenu.map((column, cIdx) => (
                  <div key={cIdx} className="w-full">
                    <div
                      className="flex justify-between items-center py-4 px-6 border-b border-zinc-200 cursor-pointer"
                      onClick={() => toggleSubMenu(column.title)}
                    >
                      <span
                        className={`text-xs font-mono font-bold uppercase tracking-widest ${expandedMenus[column.title] ? "text-[#da0e19]" : "text-zinc-500"}`}
                      >
                        {column.title}
                      </span>
                      {expandedMenus[column.title] ? (
                        <MdKeyboardArrowDown className="text-zinc-400" />
                      ) : (
                        <MdKeyboardArrowRight className="text-zinc-400" />
                      )}
                    </div>

                    {expandedMenus[column.title] && (
                      <div className="w-full bg-white">
                        {column.sections.map((sec, sIdx) => (
                          <div key={sIdx} className="w-full">
                            <div
                              className="flex justify-between items-center py-3 pl-10 pr-6 border-b border-zinc-100 cursor-pointer bg-zinc-50"
                              onClick={() => toggleSubMenu(sec.subtitle)}
                            >
                              <span
                                className={`text-sm font-bold uppercase ${expandedMenus[sec.subtitle] ? "text-zinc-900" : "text-zinc-600"}`}
                              >
                                {sec.subtitle}
                              </span>
                              {expandedMenus[sec.subtitle] ? (
                                <MdKeyboardArrowDown className="text-zinc-400" />
                              ) : (
                                <MdKeyboardArrowRight className="text-zinc-400" />
                              )}
                            </div>

                            {expandedMenus[sec.subtitle] && (
                              <div className="w-full bg-white py-2">
                                {sec.links.map((link, lIdx) => (
                                  <Link
                                    key={lIdx}
                                    to={`/products?series=${link.path}`}
                                    className="flex items-center gap-3 py-2.5 pl-14 pr-6 text-sm text-zinc-500 hover:text-[#da0e19] capitalize font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    <div className="w-1 h-1 bg-zinc-300"></div>
                                    {link.name}
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
            className="flex justify-between items-center py-5 px-6 border-b border-zinc-200 hover:bg-zinc-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span
              className={`font-bold text-sm uppercase tracking-wider ${isActive("/solutions") ? "text-[#da0e19]" : "text-zinc-900"}`}
            >
              Solutions
            </span>
            <MdKeyboardArrowRight className="text-zinc-400 text-xl" />
          </Link>

          <Link
            to="/about"
            className="flex justify-between items-center py-5 px-6 border-b border-zinc-200 hover:bg-zinc-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span
              className={`font-bold text-sm uppercase tracking-wider ${isActive("/about") ? "text-[#da0e19]" : "text-zinc-900"}`}
            >
              About Us
            </span>
            <MdKeyboardArrowRight className="text-zinc-400 text-xl" />
          </Link>

          <Link
            to="/news"
            className="flex justify-between items-center py-5 px-6 border-b border-zinc-200 hover:bg-zinc-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span
              className={`font-bold text-sm uppercase tracking-wider ${isActive("/news") ? "text-[#da0e19]" : "text-zinc-900"}`}
            >
              News
            </span>
            <MdKeyboardArrowRight className="text-zinc-400 text-xl" />
          </Link>

          <Link
            to="/download"
            className="flex justify-between items-center py-5 px-6 border-b border-zinc-200 hover:bg-zinc-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span
              className={`font-bold text-sm uppercase tracking-wider ${isActive("/download") ? "text-[#da0e19]" : "text-zinc-900"}`}
            >
              Download
            </span>
            <MdKeyboardArrowRight className="text-zinc-400 text-xl" />
          </Link>
        </div>
      </div>
      <div
        className="lg:hidden absolute bottom-0 left-0 h-1 w-full bg-[#da0e19] z-50 origin-left transition-transform duration-200 ease-out"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      ></div>
    </header>
  );
};

export default Header;
