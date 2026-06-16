import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sliderData } from "../data/homeData";
import ImageSlider from "../components/HomeComponents/ImageSlider";
import { RiMenuSearchLine, RiArticleLine } from "react-icons/ri";
import { BiDownload } from "react-icons/bi";
import ProductsSection from "../components/HomeComponents/ProductsSection";
import SolutionsSection from "../components/HomeComponents/SolutionsSection";
import NewsSection from "../components/HomeComponents/NewsSection";
const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === sliderData.length - 1 ? 0 : prev + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <section className="relative w-full bg-offwhite flex flex-col justify-center items-center overflow-hidden">
        <div className="relative w-full h-[60vh] lg:h-[80vh]">
          <ImageSlider slides={sliderData} />
        </div>
      </section>
      <ProductsSection />
      <SolutionsSection />
      <NewsSection />
    </div>
  );
};

export default Home;
