import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { useSolutions } from "../hooks/useSolutions";
import { useProducts } from "../hooks/useProducts";

const Footer = () => {
  const { data: solutionsData = [] } = useSolutions();
  const { data: productsData = [] } = useProducts();

  const solutionsCategories = useMemo(() => {
    if (!Array.isArray(solutionsData)) return [];
    return solutionsData.map((cat) => cat.category_name).filter(Boolean);
  }, [solutionsData]);

  return (
    <footer className="w-full bg-[#111c2a] text-gray-300 border-t-2 border-primary">
      <div className="max-w-[1400px] mx-auto px-6 py-10 lg:py-16">
        <div className="mb-6">
          <Link to="/">
            <img
              className="h-5 md:h-10 focus:outline-none"
              src="Pixsys2.png"
              alt=""
            />
          </Link>
        </div>

        <hr className="border-t border-primary w-full my-6 opacity-80" />

        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          <div className="hidden md:flex flex-wrap lg:grid lg:grid-cols-4 gap-8 lg:gap-12 w-full md:w-2/3 lg:w-3/4">
            <div>
              <Link to={"/products"}>
                <h3 className="text-white font-bold text-lg mb-6">Products</h3>
              </Link>
              <ul className="space-y-4 text-sm text-gray-400">
                {productsData.map((category, idx) => (
                  <li key={category.category_id}>
                    <Link
                      to={`/products?category=${category.category_id}`}
                      className="hover:text-white transition-colors"
                    >
                      {category.category_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <Link to="/solutions">
                <h3 className="text-white font-bold text-lg mb-6">Solutions</h3>
              </Link>
              <div className="flex gap-16">
                <ul className="space-y-4 text-sm text-gray-400">
                  {solutionsCategories
                    .filter((category) => category !== "All")
                    .map((category) => (
                      <li key={category}>
                        <Link
                          to={`/solutions?category=${category}`}
                          className="hover:text-white transition-colors"
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div>
              <Link to={"/about"}>
                <h3 className="text-white font-bold text-lg mb-6">About Us</h3>
              </Link>

              <Link to={"/news"}>
                <h3 className="text-white font-bold text-lg mb-6">News</h3>
              </Link>
              <Link
                to="/download"
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
            {/* <a
              href="https://info@pixsysglobal.com"
              className="text-primary font-bold text-lg mb-8 hover:text-white transition-colors"
            >
              info@pixsysglobal.com
            </a> */}
            <h1 className="text-primary font-bold text-lg mb-8 hover:text-white transition-colors">
              info@pixsysglobal.com
            </h1>

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
          <p>
            COPYRIGHT &copy;{" "}
            <a href="https://shivvilonsolutions.com/">ShivvilonSolutions</a> All
            Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
