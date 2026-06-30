import React from "react";
import { HiOutlineArrowRight } from "react-icons/hi";

const MainCategoryGrid = ({
  categories = [],
  onSelectCategory,
  isLoading,
  error,
}) => {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Products</h2>
      </div>

      {error && (
        <div className="w-full py-12 flex flex-col items-center justify-center text-center bg-red-50 rounded-lg border border-red-100">
          <p className="text-red-600 font-semibold mb-2">
            Oops! Something went wrong.
          </p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {isLoading && !error && (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading Products...
        </div>
      )}

      {!isLoading && !error && categories.length === 0 && (
        <div className="text-center py-12 text-gray-500 uppercase tracking-widest font-bold">
          No categories available.
        </div>
      )}

      {!isLoading && !error && categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.category_id}
              onClick={() => onSelectCategory(cat.category_id)}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="w-full h-48 mb-6 flex items-center justify-center bg-gray-50 rounded p-4">
                <img
                  src={cat.category_img}
                  alt={cat.category_name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#da0e19] transition-colors">
                  {cat.category_name}
                </h3>
                <HiOutlineArrowRight className="text-gray-400 group-hover:text-[#da0e19] group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">
                {cat.tagline}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainCategoryGrid;
