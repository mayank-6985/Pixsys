import React, { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

import { useProducts } from "../hooks/useProducts";
import { productsBulkData } from "../data/ProductsData";

import ProductHero from "../components/ProductsComponents/ProductHero";
import MainCategoryGrid from "../components/ProductsComponents/MainCategoryGrid";
import DetailedProductView from "../components/ProductsComponents/DetailedProductView";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSeries = searchParams.get("series");
  const urlCategory = searchParams.get("category");
  const { data: productsData = [], isLoading } = useProducts();

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeSeries, setActiveSeries] = useState(null);

  useEffect(() => {
    if (!productsData || productsData.length === 0) return;

    if (urlSeries) {
      for (const cat of productsData) {
        if (!cat.subcategories) continue;
        for (const sub of cat.subcategories) {
          if (!sub.tags) continue;
          if (sub.tags.some((tag) => tag.name === urlSeries)) {
            setActiveCategory(cat);
            setActiveSection(sub);
            setActiveSeries(urlSeries);
            return;
          }
        }
      }
    } else if (urlCategory) {
      const cat =
        productsData.find((c) => c.category_name === urlCategory) ||
        productsData[0];

      if (cat) {
        setActiveCategory(cat);
        const firstSub = cat.subcategories?.[0];
        setActiveSection(firstSub || null);
        setActiveSeries(firstSub?.tags?.[0]?.name || null);
      }
    } else {
      setActiveCategory(null);
      setActiveSection(null);
      setActiveSeries(null);
    }
  }, [urlSeries, urlCategory, productsData]);

  const handleBackToMain = () => setSearchParams({});

  const displayedProducts = productsBulkData.filter(
    (p) => p.series === activeSeries,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden pb-20">
      <ProductHero />

      <div className="max-w-7xl mx-auto px-6 mt-6 mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaHome
            className="text-[#da0e19] text-lg cursor-pointer"
            onClick={handleBackToMain}
          />
          <span
            className="cursor-pointer hover:text-[#da0e19]"
            onClick={handleBackToMain}
          >
            Products
          </span>
          {activeCategory && (
            <>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-800">
                {activeCategory.category_name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {!activeCategory ? (
          <MainCategoryGrid
            categories={productsData}
            onSelectCategory={(categoryName) =>
              setSearchParams({ category: categoryName })
            }
          />
        ) : (
          <DetailedProductView
            activeCategory={activeCategory}
            activeSection={activeSection}
            activeSeries={activeSeries}
            displayedProducts={displayedProducts}
            onSelectSeries={(seriesName) =>
              setSearchParams({ series: seriesName })
            }
            onBack={handleBackToMain}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
