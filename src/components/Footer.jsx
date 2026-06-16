import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#111c2a] text-gray-300 border-t-2 border-primary">
      <div className="max-w-[1400px] mx-auto px-6 py-10 lg:py-16">
        <div className="mb-6">
          <Link
            to="/"
          >
        <img className="h-5 md:h-10 focus:outline-none" src="Pixsys2.png" alt="" />
          </Link>
        </div>

        <hr className="border-t border-primary w-full my-6 opacity-80" />

        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          <div className="hidden md:flex flex-wrap lg:grid lg:grid-cols-5 gap-8 lg:gap-12 w-full md:w-2/3 lg:w-3/4">
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Products</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Control Technology
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    HMI
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Servo Drive
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Servo Motor
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    VFDs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-white font-bold text-lg mb-6">Solutions</h3>
              <div className="flex gap-16">
                <ul className="space-y-4 text-sm text-gray-400">
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      PV
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Laser
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Textile
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Packaging
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Woodworking
                    </Link>
                  </li>
                </ul>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      EE
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Robot
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-white transition-colors">
                      Fluid
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6">About Us</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Enter HCFA
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Talent Development
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6">News</h3>
              <ul className="space-y-4 text-sm text-gray-400 mb-8">
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Company News
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Events
                  </Link>
                </li>
              </ul>
              <Link
                to="#"
                className="text-white font-bold text-lg hover:text-primary transition-colors block"
              >
                Download
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col items-start">
            <h3 className="hidden md:block text-white font-bold text-lg mb-6">
              Contact Us
            </h3>
            <a
              href="mailto:leo.wang@hcfa.cn"
              className="text-primary font-bold text-lg mb-8 hover:text-white transition-colors"
            >
              leo.wang@hcfa.cn
            </a>

            <h3 className="hidden md:block text-white font-bold text-lg mb-6">
              Subscribe to the latest updates
            </h3>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-gray-500 text-primary flex items-center justify-center text-lg hover:bg-gray-600 transition-colors"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-gray-500 text-primary flex items-center justify-center text-lg hover:bg-gray-600 transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-gray-500 text-primary flex items-center justify-center text-lg hover:bg-gray-600 transition-colors"
              >
                <FaYoutube />
              </a>
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-gray-500 text-primary flex items-center justify-center text-lg hover:bg-gray-600 transition-colors"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-gray-400 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Link to="#" className="hover:text-white transition-colors">
              Website
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="#" className="hover:text-white transition-colors">
              Legal Statement
            </Link>
          </div>
          <p>COPYRIGHT &copy; Shivvilon-Solutions All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
