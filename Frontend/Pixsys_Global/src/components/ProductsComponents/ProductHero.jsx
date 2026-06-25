import React from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const ProductHero = () => {
  return (
    <section className="relative w-full h-[300px] md:h-[350px] bg-[#0f172a] flex flex-col justify-center items-center overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#da0e19] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-200"></div>
      </div>

      <div className="relative z-10 max-w-3xl w-full px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Search Products
        </h1>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Please enter keywords to search"
            className="w-full bg-white text-gray-900 py-4 px-6 pr-12 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-[#da0e19]"
          />
          <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        </div>
        <div className="mt-4 text-sm text-gray-300">
          Trending searches:{" "}
          <span className="text-white font-medium ml-2 space-x-2">
            <Link to="/products?series=e630" className="hover:text-[#da0e19]">
              E630 |
            </Link>
            <Link to="/products?series=v300" className="hover:text-[#da0e19]">
              {" "}
              V300 |
            </Link>
            <Link
              to="/products?series=q-series"
              className="hover:text-[#da0e19]"
            >
              {" "}
              Q Series
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;