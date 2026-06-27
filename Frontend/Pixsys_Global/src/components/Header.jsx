import { useState, useEffect, useRef, useMemo } from "react";
import { BiMenu, BiSearch } from "react-icons/bi";
import { FaXmark } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { useSolutions } from "../hooks/useSolutions";
import { useProducts } from "../hooks/useProducts";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState({});
  const circleRef = useRef(null);

  const { data: solutionsData = [] } = useSolutions();
  const { data: productsData = [] } = useProducts();

  const derivedCategories = useMemo(() => {
    if (!Array.isArray(solutionsData)) return [];
    return solutionsData.map((cat) => cat.category_name).filter(Boolean);
  }, [solutionsData]);

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
    <header className="bg-[#e10000] text-zinc-900 border-b border-red-500 sticky top-0 z-[999] w-full">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex-shrink-0 relative h-full flex items-center pr-6 md:pr-10">
          <div
            className="absolute top-0 bottom-1 left-[-100vw] right-0 bg-zinc-50 shadow-[4px_0_15px_rgba(0,0,0,0.15)] rounded-br-[40px] pointer-events-none border-b border-r border-zinc-200"
            aria-hidden="true"
          ></div>

          <Link to="/" className="focus:outline-none block relative z-10">
            <img
              className="h-6 md:h-10 drop-shadow-sm"
              src="/Pixsys.png"
              alt="Pixsys Logo"
            />
          </Link>
        </div>
        <nav className="hidden lg:flex h-full">
          <ul className="flex items-center gap-10 text-sm font-bold uppercase tracking-wider h-full">
            <li className="h-full flex items-center">
              <Link
                to="/"
                className={`relative h-full flex items-center transition-colors ${
                  isActive("/") ? "text-white" : "text-white"
                }`}
              >
                Home
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-white transition-transform duration-300 origin-left ${
                    isActive("/") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>

            <li className="group h-full flex items-center">
              <Link
                to="/products"
                className={`relative h-full flex items-center transition-colors ${
                  isActive("/products") ? "text-white" : "text-white "
                }`}
              >
                Products
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-white transition-transform duration-300 origin-left ${
                    isActive("/products") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>

              <div className="absolute top-full left-0 w-full bg-[#f8f9fa] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-5 gap-8">
                  {productsData.map((category, idx) => (
                    <div
                      key={category.category_id || idx}
                      className="border-l border-zinc-200 pl-6 first:border-0 first:pl-0"
                    >
                      <Link
                        to={`/products?category=${category.category_id}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="inline-block text-xl font-mono font-bold text-zinc-950 hover:text-[#da0e19] uppercase tracking-widest mb-6 transition-colors"
                      >
                        {category.category_name}
                      </Link>

                      {category.subcategories?.map((subcategory, sIdx) => (
                        <div
                          key={subcategory.subcategory_id || sIdx}
                          className={
                            sIdx !== category.subcategories.length - 1
                              ? "mb-6"
                              : ""
                          }
                        >
                          <Link
                            to={`/products?category=${category.category_id}&sub=${subcategory.subcategory_id}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="inline-block text-zinc-900 hover:text-[#da0e19] font-bold uppercase text-sm mb-3 transition-colors"
                          >
                            {subcategory.name}
                          </Link>

                          <ul className="space-y-2">
                            {subcategory.tags?.map((tag, lIdx) => (
                              <li key={tag.tag_id || lIdx}>
                                <Link
                                  to={`/products?category=${category.category_id}&sub=${subcategory.subcategory_id}&series=${tag.tag_id}`}
                                  className="group/link flex items-center gap-2 text-sm text-zinc-500 hover:text-[#da0e19] transition-colors font-medium capitalize w-fit"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <div className="w-1.5 h-1.5 bg-[#da0e19] opacity-0 group-hover/link:opacity-100 transition-opacity"></div>
                                  <span className="-ml-3 group-hover/link:ml-0 transition-all duration-300">
                                    {tag.name}
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
                  isActive("/solutions") ? "text-white" : "text-white"
                }`}
              >
                Solutions
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-white transition-transform duration-300 origin-left ${
                    isActive("/solutions") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>

              <div className="absolute top-full left-0 w-full bg-[#f8f9fa]  shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-8 flex justify-center gap-8 items-center">
                  <div className="flex flex-wrap justify-center gap-12 text-sm font-bold text-zinc-900 p-3">
                    {derivedCategories
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
                  isActive("/about") ? "text-white" : "text-white"
                }`}
              >
                About Us
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-white transition-transform duration-300 origin-left ${
                    isActive("/about") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>

            <li className="group h-full flex items-center">
              <Link
                to="/news"
                className={`relative h-full flex items-center transition-colors ${
                  isActive("/news") ? "text-white" : "text-white"
                }`}
              >
                News
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-white transition-transform duration-300 origin-left ${
                    isActive("/news") ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>

            <li className="h-full flex items-center">
              <Link
                to="/download"
                className={`relative h-full flex items-center transition-colors ${
                  isActive("/download") ? "text-white" : "text-white"
                }`}
              >
                Download
                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] bg-white transition-transform duration-300 origin-left ${
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
            className="p-2 text-white hover:text-white transition-colors cursor-pointer"
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
                className="text-red-300"
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
                className="text-white"
              />
            </svg>
          </div>

          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);

              if (isSearchOpen) setIsSearchOpen(false);
            }}
            className="lg:hidden p-2 text-white transition-colors"
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
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const trimmed = searchText.trim();
                      if (trimmed) {
                        navigate(
                          `/search?keyword=${encodeURIComponent(trimmed)}`,
                        );
                        setIsSearchOpen(false);
                      }
                    }
                  }}
                  placeholder="Search Keyword..."
                  autoFocus={isSearchOpen}
                />

                <button
                  onClick={() => {
                    const trimmed = searchText.trim();
                    if (!trimmed) return;
                    navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
                    setIsSearchOpen(false);
                  }}
                  className="text-gray-400 hover:text-[#da0e19] transition-colors flex-shrink-0 cursor-pointer"
                >
                  <BiSearch size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden absolute w-full left-0 bg-white shadow-2xl overflow-y-auto transition-all duration-[500ms] ease-in-out  ${
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
                {productsData.map((category, cIdx) => (
                  <div key={category.category_id || cIdx} className="w-full">
                    <div
                      className="flex justify-between items-center py-4 px-6 border-b border-zinc-200 cursor-pointer"
                      onClick={() => toggleSubMenu(category.category_name)}
                    >
                      <span
                        className={`text-xs font-mono font-bold uppercase tracking-widest ${expandedMenus[category.category_name] ? "text-[#da0e19]" : "text-zinc-500"}`}
                      >
                        {category.category_name}
                      </span>

                      {expandedMenus[category.category_name] ? (
                        <MdKeyboardArrowDown className="text-zinc-400" />
                      ) : (
                        <MdKeyboardArrowRight className="text-zinc-400" />
                      )}
                    </div>

                    {expandedMenus[category.category_name] && (
                      <div className="w-full bg-white">
                        {category.subcategories?.map((subcategory, sIdx) => (
                          <div
                            key={subcategory.subcategory_id || sIdx}
                            className="w-full"
                          >
                            <div
                              className="flex justify-between items-center py-3 pl-10 pr-6 border-b border-zinc-100 cursor-pointer bg-zinc-50"
                              onClick={() => toggleSubMenu(subcategory.name)}
                            >
                              <span
                                className={`text-sm font-bold uppercase ${expandedMenus[subcategory.name] ? "text-zinc-900" : "text-zinc-600"}`}
                              >
                                {subcategory.name}
                              </span>

                              {expandedMenus[subcategory.name] ? (
                                <MdKeyboardArrowDown className="text-zinc-400" />
                              ) : (
                                <MdKeyboardArrowRight className="text-zinc-400" />
                              )}
                            </div>

                            {expandedMenus[subcategory.name] && (
                              <div className="w-full bg-white py-2">
                                {subcategory.tags?.map((tag, lIdx) => (
                                  <Link
                                    key={tag.tag_id || lIdx}
                                    to={`/products?category=${category.category_id}&sub=${subcategory.subcategory_id}&series=${tag.tag_id}`}
                                    className="flex items-center gap-3 py-2.5 pl-14 pr-6 text-sm text-zinc-500 hover:text-[#da0e19] capitalize font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    <div className="w-1 h-1 bg-zinc-300"></div>
                                    {tag.name}
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

          <div className="w-full border-b border-zinc-200">
            <div
              className="flex justify-between items-center py-5 px-6 cursor-pointer hover:bg-zinc-50"
              onClick={() => toggleSubMenu("solutions")}
            >
              <span
                className={`font-bold text-sm uppercase tracking-wider ${isActive("/solutions") ? "text-[#da0e19]" : "text-zinc-900"}`}
              >
                Solutions
              </span>

              <span className="text-zinc-400">
                {expandedMenus["solutions"] ? (
                  <FaXmark />
                ) : (
                  <MdKeyboardArrowDown className="text-xl" />
                )}
              </span>
            </div>

            {expandedMenus["solutions"] && (
              <div className="w-full bg-[#f8f9fa] border-t border-zinc-200">
                {derivedCategories
                  .filter((category) => category !== "All")
                  .map((category) => (
                    <Link
                      key={category}
                      to={`/solutions?category=${category}`}
                      className="flex justify-between items-center py-4 pl-10 pr-6 border-b border-zinc-200 cursor-pointer transition-colors hover:bg-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 hover:text-[#da0e19] transition-colors">
                        {category}
                      </span>

                      <MdKeyboardArrowRight className="text-zinc-300" />
                    </Link>
                  ))}
              </div>
            )}
          </div>

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
        className="lg:hidden absolute bottom-0 left-0 h-1 w-full bg-white z-50 origin-left transition-transform duration-200 ease-out"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      ></div>
    </header>
  );
};

export default Header;
