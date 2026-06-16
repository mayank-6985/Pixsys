import { useState } from "react";
import { BiMenu, BiSearch } from "react-icons/bi";
import { FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [expandedMenus, setExpandedMenus] = useState({
    products: true,
    controlTech: true,
    pacIpc: true,
  });

  const toggleSubMenu = (menuKey) => {
    setExpandedMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  return (
    <header className="bg-white text-primary-text shadow-lg sticky top-0 z-[999] w-full">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight text-primary italic focus:outline-none"
          >
            <img className="h-10  " src="/Pixsys.png" />
          </Link>
        </div>

        <nav className="hidden lg:flex h-full">
          <ul className="flex items-center gap-10 font-medium text-[15px] h-full">
            <li className="h-full flex items-center border-b-2 border-primary">
              <Link
                to="/"
                className="hover:text-primary transition-colors h-full flex items-center"
              >
                Home
              </Link>
            </li>

            <li className="group h-full flex items-center">
              <Link
                to="/products"
                className="hover:text-primary transition-colors h-full flex items-center"
              >
                Products
              </Link>
              <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-5 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
                      Control Technology
                    </h3>

                    <div className="mb-4">
                      <h4 className="text-primary font-medium mb-2">PAC/IPC</h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            to="/products/q-series"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - Q series
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-primary font-medium mb-2">PLC</h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            to="/products/m-series"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - M series
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-primary font-medium mb-2">IO</h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            to="/products/q-module"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - Q series module
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/q-expansion"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - Q0P/Q1P expansion card
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/m-module"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - M series module
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/m-expansion"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - M series expansion card
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/nxe-io"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - NXE series remote IO
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
                      HMI
                    </h3>
                    <div>
                      <h4 className="text-primary font-medium mb-2">
                        V series
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            to="/products/v100"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - V100 series
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/v300"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - V300 series
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
                      Servo Drive
                    </h3>

                    <div className="mb-4">
                      <h4 className="text-primary font-medium mb-2">
                        Single axis
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            to="/products/730"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - 730 series
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/x-drive"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - X series
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/y7s"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - Y7S series
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-primary font-medium mb-2">
                        Multi-axis
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            to="/products/730w"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - 730W series
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
                      Servo Motor
                    </h3>
                    <div>
                      <h4 className="text-primary font-medium mb-2">
                        X series
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            to="/products/x0-motor"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - X0 motor
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/x2-motor"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - X2 motor
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/x6-motor"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - X6 motor
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
                      VFDs
                    </h3>
                    <div>
                      <h4 className="text-primary font-medium mb-2">
                        E series
                      </h4>
                      <ul className="space-y-1">
                        <li>
                          <Link
                            to="/products/e600"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - E600 series
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/e610"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - E610 series
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/e630"
                            className="text-sm text-gray-500 hover:text-primary"
                          >
                            - E630 series
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li className="group h-full flex items-center">
              <Link
                to="/solutions"
                className="hover:text-primary transition-colors h-full flex items-center"
              >
                Solutions
              </Link>
              <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-3 flex justify-center gap-8 items-center">
                  <div className="flex gap-10 text-lg font-bold text-gray-900 p-3">
                    <Link to="/solutions/pv">
                      <h3>PV</h3>
                    </Link>
                    <Link to="/solutions/leser">
                      <h3>Laser</h3>
                    </Link>
                    <Link to="/solutions/texttile">
                      <h3>Textile</h3>
                    </Link>
                    <Link to="/solutions/packaging">
                      <h3>Packaging</h3>
                    </Link>
                    <Link to="/solutions/woodworking">
                      <h3>Woodworking</h3>
                    </Link>
                    <Link to="/solutions/ee">
                      <h3>EE</h3>
                    </Link>
                    <Link to="/solutions/robot">
                      <h3>Robot</h3>
                    </Link>
                    <Link to="/solutions/fluid">
                      <h3>Fluid</h3>
                    </Link>
                  </div>
                </div>
              </div>
            </li>

            <li className="group h-full flex items-center">
              <Link
                to="/about"
                className="hover:text-primary transition-colors h-full flex items-center"
              >
                About Us
              </Link>
              <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-3 flex justify-center gap-8 items-center">
                  <div className="flex gap-10 text-lg font-bold text-gray-900 p-3">
                    <Link to="/about/index">
                      <h3>Enter HCFA</h3>
                    </Link>
                    <Link to="/about/talent">
                      <h3>Talent Development</h3>
                    </Link>
                    <Link to="/about/contact">
                      <h3>Contact Us</h3>
                    </Link>
                  </div>
                </div>
              </div>
            </li>

            <li className="group h-full flex items-center">
              <Link
                to="/news"
                className="hover:text-primary transition-colors h-full flex items-center"
              >
                News
              </Link>
              <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-3 flex justify-center gap-8 items-center">
                  <div className="flex gap-10 text-lg font-bold text-gray-900 p-3">
                    <Link to="/news/index">
                      <h3>News</h3>
                    </Link>
                    <Link to="/news/events">
                      <h3>Events</h3>
                    </Link>
                    <Link to="/news/newsletter">
                      <h3>Newsletter</h3>
                    </Link>
                  </div>
                </div>
              </div>
            </li>

            <li className="h-full flex items-center">
              <Link
                to="/download"
                className="hover:text-primary transition-colors h-full flex items-center"
              >
                Download
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center text-gray-600 hover:text-primary transition-colors sm:border-l sm:border-gray-200 sm:pl-6 h-full py-4">
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
              <div className="flex text-lg text-gray-900 py-2 px-4 border border-slate-300 rounded-md items-center w-full max-w-2xl focus-within:border-primary transition-colors">
                <input
                  className="outline-none font-light w-full pr-4 bg-transparent"
                  type="text"
                  placeholder="Search Keyword..."
                  autoFocus={isSearchOpen}
                />
                <button className="text-gray-400 hover:text-primary transition-colors flex-shrink-0 cursor-pointer">
                  <BiSearch size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <span className="font-bold text-gray-900 text-[17px]">
                Products
              </span>
              {expandedMenus.products ? (
                <MdKeyboardArrowDown className="text-gray-400 text-xl" />
              ) : (
                <MdKeyboardArrowRight className="text-gray-400 text-xl" />
              )}
            </div>

            {expandedMenus.products && (
              <div className="w-full">
                <div className="w-full">
                  <div
                    className="flex justify-between items-center py-4 pl-4 border-b border-gray-100 cursor-pointer transition-colors"
                    onClick={() => toggleSubMenu("controlTech")}
                  >
                    <span
                      className={`text-[15px] ${
                        expandedMenus.controlTech
                          ? "text-[#009a44]"
                          : "text-gray-600"
                      }`}
                    >
                      Control Technology
                    </span>
                    {expandedMenus.controlTech ? (
                      <MdKeyboardArrowDown className="text-gray-400 text-xl" />
                    ) : (
                      <MdKeyboardArrowRight className="text-gray-400 text-xl" />
                    )}
                  </div>

                  {expandedMenus.controlTech && (
                    <div className="w-full">
                      <div className="w-full">
                        <div
                          className="flex justify-between items-center py-4 pl-8 border-b border-gray-100 cursor-pointer"
                          onClick={() => toggleSubMenu("pacIpc")}
                        >
                          <span
                            className={`text-[14px] ${
                              expandedMenus.pacIpc
                                ? "text-[#009a44]"
                                : "text-gray-600"
                            }`}
                          >
                            PAC/IPC
                          </span>
                          {expandedMenus.pacIpc ? (
                            <MdKeyboardArrowDown className="text-gray-400 text-xl" />
                          ) : (
                            <MdKeyboardArrowRight className="text-gray-400 text-xl" />
                          )}
                        </div>

                        {expandedMenus.pacIpc && (
                          <div className="w-full">
                            <Link
                              to="/products/q-series"
                              className="block py-4 pl-12 border-b border-gray-100 text-[14px] text-gray-500 hover:bg-gray-50"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Q series
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center py-4 pl-8 border-b border-gray-100 cursor-pointer">
                        <span className="text-[14px] text-gray-600">PLC</span>
                        <MdKeyboardArrowRight className="text-gray-400 text-xl" />
                      </div>

                      <div className="flex justify-between items-center py-4 pl-8 border-b border-gray-100 cursor-pointer">
                        <span className="text-[14px] text-gray-600">IO</span>
                        <MdKeyboardArrowRight className="text-gray-400 text-xl" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center py-4 pl-4 border-b border-gray-100 cursor-pointer">
                  <span className="text-[15px] text-gray-600">HMI</span>
                  <MdKeyboardArrowRight className="text-gray-400 text-xl" />
                </div>

                <div className="flex justify-between items-center py-4 pl-4 border-b border-gray-100 cursor-pointer">
                  <span className="text-[15px] text-gray-600">Servo Drive</span>
                  <MdKeyboardArrowRight className="text-gray-400 text-xl" />
                </div>

                <div className="flex justify-between items-center py-4 pl-4 border-b border-gray-100 cursor-pointer">
                  <span className="text-[15px] text-gray-600">Servo Motor</span>
                  <MdKeyboardArrowRight className="text-gray-400 text-xl" />
                </div>

                <div className="flex justify-between items-center py-4 pl-4 border-b border-gray-100 cursor-pointer">
                  <span className="text-[15px] text-gray-600">VFDs</span>
                  <MdKeyboardArrowRight className="text-gray-400 text-xl" />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-200 cursor-pointer">
            <span className="font-bold text-gray-900 text-[17px]">
              Solutions
            </span>
            <MdKeyboardArrowRight className="text-gray-400 text-xl" />
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-200 cursor-pointer">
            <span className="font-bold text-gray-900 text-[17px]">
              About Us
            </span>
            <MdKeyboardArrowRight className="text-gray-400 text-xl" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
