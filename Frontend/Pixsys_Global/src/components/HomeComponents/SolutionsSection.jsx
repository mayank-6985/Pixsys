import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { solutionsData } from "../../data/homeData";
import { BiRightArrow } from "react-icons/bi";
import { RiArrowRightLine } from "react-icons/ri";

const SolutionsSection = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 bg-zinc-950. overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-500 mb-4 tracking-wide">
            Solutions
          </h2>
          <p className="text-lg md:text-xl font-medium text-black">
            Deepen Expertise in Segments, Co-create an Industrial Ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutionsData.map((solution) => (
            <div
              key={solution.id}
              className="bg-white rounded-sm overflow-hidden shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col group"
            >
              <div className="w-full h-56 overflow-hidden">
                <img
                  src={solution.image}
                  alt={solution.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-500 transition-colors duration-300 mb-8">
                  {solution.title}
                </h3>

                <div className="mt-auto">
                  <Link
                    to={solution.link}
                    className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors group/link"
                  >
                    Explore
                    <FiArrowRight className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex w-full justify-center">
          <button className="px-8 py-2.5 text-[#da0e19] border border-[#da0e19] rounded-full inline-flex items-center justify-center gap-2 hover:bg-[#da0e19] hover:text-white transition-colors cursor-pointer text-lg">
            View more
            <RiArrowRightLine className="text-xl" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
