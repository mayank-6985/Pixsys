import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { productsData } from "../../data/homeData";
import ScrollReveal from "../ScrollReveal";

const ProductsSection = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 bg-[#f8f9fa] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <ScrollReveal direction="up">
          <div className="mb-16 border-l-4 border-[#da0e19] pl-6">
            <h3 className="text-2xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight">
              Products
            </h3>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productsData.map((product, index) => (
            <ScrollReveal key={product.id} delay={index * 150} direction="up">
              <Link
                to={product.link}
                className="group block bg-white border border-zinc-200 hover:border-[#da0e19] transition-colors duration-300 relative"
              >
                <div className="absolute top-0 right-0 w-3 h-3 bg-zinc-200 group-hover:bg-[#da0e19] transition-colors duration-300 z-10"></div>

                <div className="w-full h-56 bg-white flex items-center justify-center p-8 border-b border-zinc-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>

                <div className="p-6 bg-zinc-50 group-hover:bg-white transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-bold text-zinc-900 uppercase">
                      {product.title}
                    </h4>
                    <FiArrowRight className="text-zinc-400 group-hover:text-[#da0e19] group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                  <p className="text-sm text-zinc-500 font-medium">
                    {product.description}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;