import React, { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import SingleProductView from "../components/ProductsComponents/SingleProductView";

import ProductHero from "../components/ProductsComponents/ProductHero";
import MainCategoryGrid from "../components/ProductsComponents/MainCategoryGrid";
import DetailedProductView from "../components/ProductsComponents/DetailedProductView";
import {
  useCategoryDetails,
  useCategories,
  useProductDetails,
} from "../hooks/useProducts";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryId = searchParams.get("category");
  const subcatId = searchParams.get("sub");
  const tagId = searchParams.get("series");
  const productId = searchParams.get("productId");

  const { data: mainCategories } = useCategories();
  const { data: categoryDetails } = useCategoryDetails(categoryId);
  const { data: singleProduct } = useProductDetails(productId);

  const [activeSection, setActiveSection] = useState(null);
  const [activeSeriesId, setActiveSeriesId] = useState(null);

  useEffect(() => {
    if (!categoryId) {
      setActiveSection(null);
      setActiveSeriesId(null);
      return;
    }

    if (categoryDetails && categoryDetails.length > 0) {
      let currentSubcat = categoryDetails.find(
        (s) => s.subcategory_id === Number(subcatId),
      );
      if (!currentSubcat) {
        currentSubcat = categoryDetails[0];
      }
      setActiveSection(currentSubcat);

      if (currentSubcat.tags && currentSubcat.tags.length > 0) {
        const isValidTag = currentSubcat.tags.some(
          (t) => t.tag_id === Number(tagId),
        );

        if (isValidTag) {
          setActiveSeriesId(Number(tagId));
        } else {
          const firstTagId = currentSubcat.tags[0].tag_id;
          setActiveSeriesId(firstTagId);
          setSearchParams({
            category: categoryId,
            sub: currentSubcat.subcategory_id,
            series: firstTagId,
          });
        }
      } else {
        setActiveSeriesId(null);
        if (tagId || !subcatId) {
          setSearchParams({
            category: categoryId,
            sub: currentSubcat.subcategory_id,
          });
        }
      }
    }
  }, [categoryId, subcatId, tagId, categoryDetails, setSearchParams]);

  const handleBackToMain = () => setSearchParams({});

  const displayedProducts = activeSeriesId
    ? activeSection?.tags?.find((tag) => tag.tag_id === activeSeriesId)
        ?.products || []
    : [];

  const currentCategoryName = mainCategories?.find(
    (c) => c.category_id === Number(categoryId),
  )?.category_name;

  const handleBackToGrid = () => {
    setSearchParams({
      category: categoryId,
      sub: subcatId,
      series: activeSeriesId,
    });
  };

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
          {categoryId && currentCategoryName && (
            <>
              <span className="text-gray-400">&gt;</span>
              <span className="text-gray-800">{currentCategoryName}</span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {!categoryId ? (
          <MainCategoryGrid
            categories={mainCategories || []}
            onSelectCategory={(id) => setSearchParams({ category: id })}
          />
        ) : productId ? (
          <SingleProductView
            product={singleProduct}
            onBack={handleBackToGrid}
          />
        ) : (
          <DetailedProductView
            activeCategory={categoryDetails}
            activeSection={activeSection}
            activeSeries={activeSeriesId}
            displayedProducts={displayedProducts}
            onSelectSubcategory={(id) =>
              setSearchParams({ category: categoryId, sub: id })
            }
            onSelectSeries={(id) =>
              setSearchParams({
                category: categoryId,
                sub: activeSection.subcategory_id,
                series: id,
              })
            }
            onSelectProduct={(id) =>
              setSearchParams({
                category: categoryId,
                sub: activeSection.subcategory_id,
                series: activeSeriesId,
                productId: id,
              })
            }
            onBack={handleBackToMain}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
