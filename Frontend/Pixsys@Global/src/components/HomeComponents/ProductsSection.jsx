import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { productsData } from "../../data/homeData";

const ProductsSection = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 bg-white overflow-hidden">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-12 md:pl-16">
          <h2 className="text-3xl font-extrabold text-red-600 mb-2">
            Products
          </h2>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
            Advance Smart Manufacturing, <br className="hidden md:block" />
            Achieve New Productivity Frontiers
          </h3>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {productsData.map((product) => (
            <Link
              key={product.id}
              to={product.link}
              className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative"
            >
              {/* Product Image Area */}
              <div className="w-full h-56 bg-[#f8f9fa] flex items-center justify-center p-6">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product Text Area */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                    {product.title}
                  </h4>
                  <FiArrowRight className="text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-gray-500 font-medium tracking-wide">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
