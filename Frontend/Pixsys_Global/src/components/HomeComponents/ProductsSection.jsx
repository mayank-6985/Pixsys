import React, { useOptimistic } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { useCategories } from "../../hooks/useProducts";
import ScrollReveal from "../ScrollReveal";

const ProductsSection = () => {
  const { data: productsData = [] } = useCategories();
  return (
    <section className="relative w-full py-32 bg-[#f4f4f5] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-300 to-transparent"></div>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
            <div className="flex flex-col relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] bg-[#da0e19]"></div>
                <span className="font-mono text-xs font-bold text-[#da0e19] tracking-[0.4em] uppercase">
                  Hardware Specifications
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl lg:text-[5rem] font-black text-zinc-900 uppercase tracking-tighter leading-[0.9]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500">
                  Products
                </span>
              </h2>
            </div>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsData.map((product, index) => (
            <ScrollReveal
              key={product.category_id}
              delay={index * 100}
              direction="up"
            >
              <Link
                to={`\/products?category=${product.category_id}`}
                className="group block h-full bg-white relative transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] min-h-[500px]"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)",
                }}
              >
                {/* http://localhost:5173/products?category=Control%20Technologies */}

                {/* http://localhost:5173/products?category=1&sub=1&series=20 */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-end z-20 pointer-events-none">
                  {/* <div className="bg-zinc-900 text-white px-3 py-1 font-mono text-[10px] font-bold tracking-widest">
                    ID.00{index + 1}
                  </div> */}
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-[#da0e19] transition-colors duration-300"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-[#da0e19] transition-colors duration-300 delay-75"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-[#da0e19] transition-colors duration-300 delay-150"></div>
                  </div>
                </div>
                <div className="w-full h-[320px] relative bg-zinc-50 flex items-center justify-center p-12 overflow-hidden border-b border-zinc-100">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute w-64 h-64 bg-[#da0e19]/5 rounded-full blur-3xl scale-0 group-hover:scale-100 transition-transform duration-700 ease-out"></div>
                  <img
                    src={product.category_img}
                    alt={product.category_name}
                    className="w-full h-full object-contain filter drop-shadow-xl grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 ease-[cubic-bezier(0.21,1.02,0.73,1)] relative z-10"
                  />
                </div>

                <div className="p-8 pb-12 flex flex-col relative z-20 bg-white max-h-[200px] min-h-[150px]">
                  <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight mb-3 group-hover:text-[#da0e19] transition-colors duration-300 ">
                    {product.category_name}
                  </h3>
                  <p className="text-sm font-medium text-zinc-500 leading-relaxed line-clamp-1">
                    {product.tagline}
                  </p>
                </div>
                <div className="absolute -bottom-[2px] -right-[2px] w-[50px] h-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none">
                  <div
                    className="absolute inset-0 bg-[#da0e19]"
                    style={{
                      clipPath: "polygon(0 100%, 100% 0, 100% 20px, 20px 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-[#f4f4f5]"
                    style={{
                      clipPath: "polygon(20px 100%, 100% 20px, 100% 100%)",
                    }}
                  ></div>
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
