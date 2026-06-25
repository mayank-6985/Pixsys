import React, { useState } from "react";
import { HiOutlineArrowLeft, HiOutlineDownload } from "react-icons/hi";

const SingleProductView = ({ product, onBack }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!product) return null;

  const downloadTabs =
    product.downloads && typeof product.downloads === "object"
      ? Object.keys(product.downloads)
      : [];

  const hasSpecifications =
    product.specifications && product.specifications.length > 0;

  const allTabs = ["overview"];
  if (hasSpecifications) allTabs.push("specifications");
  allTabs.push(...downloadTabs);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <button
        onClick={onBack}
        className="flex items-center text-sm font-semibold text-gray-500 hover:text-[#da0e19] transition-colors mb-6"
      >
        <HiOutlineArrowLeft className="mr-2 text-lg" /> Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
          <img
            src={product.product_img}
            alt={product.name}
            className="max-h-80 object-contain mix-blend-multiply"
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-[#da0e19] font-bold text-sm tracking-wider uppercase bg-red-50 px-3 py-1 rounded-full w-fit mb-4">
            ID: {product.product_id}
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <h3 className="text-xl text-gray-500 font-medium mb-8">
            {product.tagline}
          </h3>
          <div className="w-16 h-1 bg-[#da0e19]"></div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 mb-8 gap-8 overflow-x-auto scrollbar-hide">
          {allTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm md:text-base font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-[#da0e19] border-b-[3px] border-[#da0e19]"
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              {tab.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {/* 1. Overview Tab Content */}
          {activeTab === "overview" && (
            <div className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications.map((url, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-5 border border-gray-100 rounded-lg hover:border-[#da0e19] hover:shadow-md transition-all group"
                >
                  <span className="text-base font-bold text-gray-700 group-hover:text-[#da0e19] transition-colors">
                    Specification Document {idx + 1}
                  </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-gray-50 group-hover:bg-red-50 text-gray-600 group-hover:text-[#da0e19] px-4 py-2 rounded font-bold text-sm transition-colors"
                  >
                    <HiOutlineDownload className="text-lg" />
                  </a>
                </div>
              ))}
            </div>
          )}

          {downloadTabs.includes(activeTab) && product.downloads[activeTab] && (
            <div className="grid grid-cols-1 gap-4">
              {product.downloads[activeTab].map((item) => (
                <div
                  key={item.download_id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 border border-gray-100 rounded-lg hover:border-[#da0e19] hover:shadow-md transition-all group"
                >
                  <div className="mb-4 sm:mb-0">
                    <h4 className="text-base font-bold text-gray-900 group-hover:text-[#da0e19] transition-colors uppercase">
                      {item.name}
                    </h4>
                  </div>
                  <a
                    href={item.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-gray-50 group-hover:bg-[#da0e19] text-gray-600 group-hover:text-white px-6 py-2.5 rounded font-bold text-sm transition-all"
                  >
                    Download File <HiOutlineDownload className="text-lg" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProductView;
