import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { solutionsData } from "../../data/homeData";
import ScrollReveal from "../ScrollReveal";

const SolutionsSection = () => {
  return (
    <section className="relative w-full py-16 lg:py-24 bg-white border-t border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <ScrollReveal direction="left">
            <div>
              <h3 className="text-2xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight max-w-2xl">
                Solutions
              </h3>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200}>
            <button className="group px-6 py-3 border-2 border-zinc-900 text-zinc-900 font-bold uppercase tracking-wider text-sm hover:bg-[#da0e19] hover:border-[#da0e19] hover:text-white transition-all duration-300 flex items-center gap-3">
              View All Solutions{" "}
              <FiArrowRight className="text-lg ml-2 group-hover:translate-x-2 transition-transform duration-300" />{" "}
            </button>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3  bg-white">
          {solutionsData.map((solution, index) => (
            <ScrollReveal
              key={solution.id}
              delay={index * 150}
              direction="up"
              className="h-full"
            >
              <div className="bg-white border-[0.5px] border-zinc-200 flex flex-col shadow-sm group relative overflow-hidden h-full">
                <div className="w-full h-64 overflow-hidden relative bg-zinc-900">
                  <img
                    src={solution.image}
                    alt={solution.title}
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-zinc-900 uppercase mb-8">
                    {solution.title}
                  </h3>
                  <div className="mt-auto">
                    <Link
                      to={solution.link}
                      className="inline-flex items-center text-sm font-bold text-[#da0e19] uppercase tracking-wider group/link"
                    >
                      Explore Sector
                      <FiArrowRight className="ml-2 group-hover/link:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
