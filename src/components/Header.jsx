import { useState } from "react";
import { BiMenu, BiSearch } from "react-icons/bi";
import { FaLine, FaX, FaXmark } from "react-icons/fa6";
import { MdMenuBook } from "react-icons/md";
import { RiForward30Line } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white text-primary-text shadow-lg sticky top-0 z-999 w-full">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* 1. Logo (Left Section) */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight text-primary italic focus:outline-none"
          >
            SS
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

            {/* PRODUCTS MEGA-MENU ITEM */}
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

                  {/* Column 2: HMI */}
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

                  {/* Column 3: Servo Drive */}
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

                  {/* Column 4: Servo Motor */}
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

                  {/* Column 5: VFDs */}
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

            {/* Standard Nav Items */}
            <li className="group h-full flex items-center">
              <Link
                to="/solutions"
                className=" group-[]:  hover:text-primary transition-colors h-full flex items-center"
              >
                Solutions
              </Link>
              <div className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-3 flex justify-center gap-8 items-center">
                  <div className=" flex gap-10 text-lg font-bold text-gray-900 p-3">
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
                    <Link to="/fluid">
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
                  <div className=" flex gap-10 text-lg font-bold text-gray-900 p-3">
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
                  <div className=" flex gap-10 text-lg font-bold text-gray-900 p-3">
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

        {/* 3. Right Section (Language & Mobile Toggle) */}
        <div className="flex items-center gap-6 bg-">
          <div className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-primary cursor-pointer transition-colors border-l border-gray-200 pl-6">
            <span>
              <BiSearch size={24} />
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded focus:outline-none hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className={`inline-block text-2xl transition-transform duration-500 ease-in-out ${isMenuOpen ? "rotate-[360deg]" : "rotate-0"}`}
            >
              {isMenuOpen ? <FaXmark /> : <BiMenu />}
            </span>
          </button>
        </div>
      </div>
      <div
        className={`md:hidden absolute w-full left-0 shadow-xl bg-white overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0"
        }`}
      >
        <nav className="px-4 pt-2 pb-4 space-y-2 border-t border-slate-500">
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
    </header>
  );
}
