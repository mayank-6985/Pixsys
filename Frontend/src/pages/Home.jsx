import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sliderData } from "../data/homeData";
import ImageSlider from "../components/HomeComponents/ImageSlider";
import { RiMenuSearchLine, RiArticleLine } from "react-icons/ri";
import { BiDownload } from "react-icons/bi";
import ProductsSection from "../components/HomeComponents/ProductsSection";
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

          {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] max-w-5xl bg-white shadow-2xl z-20  overflow-hidden rounded-sm ">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <Link
                to="/product-selection"
                className="flex items-center  rounded-sm justify-center gap-4 py-8 group hover:bg-red-500  transition-colors hover:scale-y-110"
              >
                <RiMenuSearchLine className="text-3xl group-hover:scale-110 text-red-500 group-hover:text-white transition-transform " />
                <span className="font-semibold text-gray-800 group-hover:text-white">
                  Product Selection
                </span>
              </Link>

              <Link
                to="/download"
                className="flex items-center justify-center gap-4 py-8 group hover:bg-red-500 transition-colors"
              >
                <BiDownload className="text-3xl text-red-500 group-hover:scale-110 transition-transform group-hover:text-white" />
                <span className="font-semibold text-gray-800 group-hover:text-white">Download</span>
              </Link>

              <Link
                to="/newsletter"
                className="flex items-center justify-center gap-4 py-8  group hover:bg-red-500 transition-colors"
              >
                <RiArticleLine className="text-3xl text-red-500 group-hover:text-white group-hover:scale-110 transition-transform" />
                <span className="font-semibold group-hover:text-white text-gray-800">Newsletter</span>
              </Link>
            </div>
          </div> */}
        </div>
      </section>
      <ProductsSection />
    </div>
  );
};

export default Home;
