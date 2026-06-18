import React from "react";
import { HiOutlineArrowRight } from "react-icons/hi";

const MainCategoryGrid = ({ categories, onSelectCategory }) => {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Products</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => onSelectCategory(cat.title)}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="w-full h-48 mb-6 flex items-center justify-center bg-gray-50 rounded p-4">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#da0e19] transition-colors">
                {cat.title}
              </h3>
              <HiOutlineArrowRight className="text-gray-400 group-hover:text-[#da0e19] group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{cat.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainCategoryGrid;