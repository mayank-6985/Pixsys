import React from "react";
import { RiArrowRightLine } from "react-icons/ri";
import { newsData } from "../../data/homeData";

const NewsSection = () => {
  return (
    <section className="bg-[#f8f9fa] py-20 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#da0e19] mb-2">
            News
          </h2>
          <p className="text-xl font-bold text-gray-800 mb-12">
            Stay Updated with HCFA
          </p>

          <div className="flex flex-col">
            {newsData.map((item, index) => (
              <div
                key={item.id}
                className={`py-6 ${index !== 0 ? "pt-6" : "pt-0"} ${index !== newsData.length - 1 ? "border-b border-gray-200" : ""}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-[1px] bg-gray-300"></div>
                  <span className="text-sm font-light text-gray-400">
                    {item.date}
                  </span>
                </div>

                <a href={item.link} className="group">
                  <h3 className="text-[1.1rem] leading-snug font-bold text-gray-800 group-hover:text-[#da0e19] transition-colors duration-300 pr-4">
                    {item.title}
                  </h3>
                </a>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <button className="px-6 py-2.5 bg-transparent border border-[#da0e19] text-[#da0e19] rounded-full inline-flex items-center gap-2 hover:text-white hover:bg-[#da0e19] transition-colors duration-300 cursor-pointer font-medium text-sm">
              View more
              <RiArrowRightLine className="text-lg" />
            </button>
          </div>
        </div>

        <div className="relative hidden lg:flex items-center justify-center min-h-[500px]">
          <div
            className="absolute top-24 right-4 w-[450px] h-[280px] shadow-2xl overflow-hidden z-10"
            style={{ clipPath: "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80"
              alt="Conference Main"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="absolute bottom-4 left-0 w-[220px] h-[140px] shadow-xl overflow-hidden z-20"
            style={{ clipPath: "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80"
              alt="Conference Side"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute -bottom-16 right-16 w-[280px] h-[200px] shadow-xl overflow-hidden z-20"
            style={{ clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80"
              alt="Exhibition Booth"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
