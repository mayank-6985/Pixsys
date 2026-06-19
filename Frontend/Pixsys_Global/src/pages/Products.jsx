import React, { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import {
  productMenu,
  mainCategories,
  productsBulkData,
} from "../data/ProductsData";

import ProductHero from "../components/ProductsComponents/ProductHero";
import MainCategoryGrid from "../components/ProductsComponents/MainCategoryGrid";
import DetailedProductView from "../components/ProductsComponents/DetailedProductView";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSeries = searchParams.get("series");
  const urlCategory = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [activeSeries, setActiveSeries] = useState(null);

  useEffect(() => {
    if (urlSeries) {
      for (const cat of productMenu) {
        for (const sec of cat.sections) {
          if (sec.links.some((link) => link.path === urlSeries)) {
            setActiveCategory(cat);
            setActiveSection(sec);
            setActiveSeries(urlSeries);
            return;
          }
        }
      }
    } else if (urlCategory) {
      const cat =
        productMenu.find((c) => c.title === urlCategory) || productMenu[0];
      setActiveCategory(cat);
      setActiveSection(cat.sections[0]);
      setActiveSeries(cat.sections[0].links[0].path);
    } else {
      setActiveCategory(null);
      setActiveSection(null);
      setActiveSeries(null);
    }
  }, [urlSeries, urlCategory]);

  const handleBackToMain = () => setSearchParams({});
  const displayedProducts = productsBulkData.filter(
    (p) => p.series === activeSeries,
  );

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
              <span className="text-gray-800">{activeCategory.title}</span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {!activeCategory ? (
          <MainCategoryGrid
            categories={mainCategories}
            onSelectCategory={(categoryTitle) =>
              setSearchParams({ category: categoryTitle })
            }
          />
        ) : (
          <DetailedProductView
            activeCategory={activeCategory}
            activeSection={activeSection}
            activeSeries={activeSeries}
            displayedProducts={displayedProducts}
            onSelectSeries={(seriesPath) =>
              setSearchParams({ series: seriesPath })
            }
            onBack={handleBackToMain}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
