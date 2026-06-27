import React, { useState, useEffect } from "react";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../api";
import SingleProductView from "./SingleProductView";

const ProductHero = () => {
  const [searchInput, setSearchInput] = useState("");
  const [activeKeyword, setActiveKeyword] = useState(""); 
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeKeyword) {
        setProducts([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/search/products/?keyword=${activeKeyword}`,
        );
        setProducts(response.data?.products || []);
      } catch (err) {
        setError(err.message || "Failed to fetch products.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeKeyword])
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveKeyword(searchInput.trim());
    setSelectedProduct(null);
  };

  const handleTrendingClick = (keyword) => {
    setSearchInput(keyword);
    setActiveKeyword(keyword);
    setSelectedProduct(null);
  };

  return (
    <div
      className={`bg-[#f8f9fa] font-sans transition-all duration-300 ${activeKeyword ? "min-h-screen pb-12" : ""}`}
    >
      <section className="relative w-full h-[300px] md:h-[350px] bg-[#0f172a] flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-10 right-10 w-96 h-96 bg-[#da0e19] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-200"></div>
        </div>

        <div className="relative z-10 max-w-3xl w-full px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Search Products
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Please enter keywords to search"
              className="w-full bg-white text-gray-900 py-4 px-6 pr-12 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-[#da0e19] transition-shadow"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#da0e19] transition-colors p-2"
            >
              <FiSearch className="text-xl" />
            </button>
          </form>
        </div>
      </section>
      {activeKeyword && (
        <div className="max-w-[1200px] mx-auto px-6 pt-12 animate-in fade-in duration-500 slide-in-from-bottom-4">
          {selectedProduct ? (
            <SingleProductView
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
            />
          ) : (
            <div>
              {isLoading ? (
                <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">
                  Searching...
                </div>
              ) : error ? (
                <div className="text-center py-20 text-[#da0e19] font-bold uppercase tracking-widest">
                  {error}
                </div>
              ) : products.length > 0 ? (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-widest">
                    Results for "{activeKeyword}"
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <button
                        key={product.product_id}
                        onClick={() => setSelectedProduct(product)}
                        className="group text-left bg-white border border-gray-200 rounded-lg p-6 flex flex-col hover:border-[#da0e19] hover:shadow-lg transition-all duration-300 relative overflow-hidden w-full"
                      >
                        <div className="h-32 w-full mb-6 flex items-center justify-center">
                          <img
                            src={
                              product.product_img 
                            }
                            alt={product.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                          />
                        </div>
                        <h3 className="text-[16px] font-bold text-gray-900 mb-2 group-hover:text-[#da0e19] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3 mb-6 flex-grow">
                          {product.tagline || product.description}
                        </p>
                        <div className="flex items-center justify-between text-gray-400 group-hover:text-[#da0e19] transition-colors mt-auto pt-4 border-t border-gray-100 w-full">
                          <span className="text-[12px] font-bold uppercase tracking-widest">
                            View Details
                          </span>
                          <FiArrowRight size={16} />
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">
                  No products found for "{activeKeyword}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductHero;
