import React from "react";
import { HiOutlineArrowRight } from "react-icons/hi";

const DetailedProductView = ({
  activeCategory,
  activeSection,
  activeSeries,
  displayedProducts,
  onSelectSeries,
  onBack,
}) => {
  if (!activeCategory || !activeSection) return null;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200">
        <div className="flex gap-8 overflow-x-auto w-full md:w-auto">
          {activeCategory.sections.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSeries(sec.links[0].path)}
              className={`pb-4 text-base font-semibold transition-colors relative ${
                activeSection.subtitle === sec.subtitle
                  ? "text-[#da0e19]"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {sec.subtitle}
              {activeSection.subtitle === sec.subtitle && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#da0e19]"></div>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={onBack}
          className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-br from-[#da0f1a] to-[#c9c9c9] text-white rounded font-medium shadow-md hover:shadow-lg transition-all"
        >
          Back
        </button>
      </div>

      <div className="bg-gray-100 rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[250px] mb-8">
        <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {activeSection.subtitle}
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl">
            {activeSection.description}
          </p>
        </div>
        <div className="w-full md:w-5/12 hidden md:block">
          <img
            src={activeSection.bannerImg}
            alt={activeSection.subtitle}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* PILLS */}
      <div className="flex flex-wrap gap-3 mb-10">
        {activeSection.links.map((link, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSeries(link.path)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm ${
              activeSeries === link.path
                ? "bg-[#da0e19] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-[#da0e19] hover:border-red-200"
            }`}
          >
            {link.name}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-shadow relative overflow-hidden group cursor-pointer"
            >
              {product.isNew && (
                <div className="absolute top-4 -right-8 w-32 bg-[#da0e19] text-white text-xs font-bold py-1 text-center rotate-45 shadow-sm">
                  NEW
                </div>
              )}
              <div className="w-full h-48 mb-6 bg-gray-50 rounded flex items-center justify-center p-4">
                <img
                  src={product.img}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                {product.desc}
              </p>
              <div className="flex items-center text-sm font-semibold text-gray-400 group-hover:text-[#da0e19] transition-colors">
                Learn More{" "}
                <HiOutlineArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          No products found for this series.
        </div>
      )}
    </div>
  );
};

export default DetailedProductView;
