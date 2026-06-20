import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { solutionsData } from "../../data/homeData";
import ScrollReveal from "../ScrollReveal";

const SolutionsSection = () => {
  return (
    <section className="bg-[#f8f9fa] py-24 lg:py-32 w-full border-t border-zinc-200 ">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="max-w-3xl">
              <h2 className="text-sm font-bold text-[#da0e19] uppercase tracking-[0.2em] mb-4">
                Industry Applications
              </h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black  uppercase tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500">
                Solutions
              </h3>
            </div>

            <Link
              to="/solutions"
              className="group inline-flex items-center gap-4 pb-2 border-b-2 border-zinc-300 hover:border-[#da0e19] transition-colors duration-300"
            >
              <span className="text-sm font-bold text-zinc-900 uppercase tracking-widest group-hover:text-[#da0e19] transition-colors">
                Explore All Sectors
              </span>
              <FiArrowRight className="text-xl text-zinc-900 group-hover:text-[#da0e19] group-hover:translate-x-2 transition-all duration-300" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutionsData.map((solution, index) => (
            <ScrollReveal
              key={solution.id}
              delay={index * 100}
              direction="up"
              className="h-full"
            >
              <Link
                to={solution.link}
                className="group flex flex-col h-full bg-white border border-zinc-200 hover:border-transparent hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 relative"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-[#da0e19] transition-colors duration-500 z-20"></div>

                <div className="w-full h-[300px] relative overflow-hidden bg-zinc-100">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img
                    src={solution.image}
                    alt={solution.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                  />
                </div>

                <div className="flex flex-col flex-grow p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-xs font-bold text-zinc-400 tracking-widest">
                      0{index + 1}
                    </span>
                    <div className="flex-grow h-px bg-zinc-200"></div>
                  </div>

                  <h4 className="text-2xl font-black text-zinc-900 uppercase tracking-tight mb-8 group-hover:text-[#da0e19] transition-colors duration-300">
                    {solution.title}
                  </h4>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-900 transition-colors">
                      Discover
                    </span>
                    <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-[#da0e19] group-hover:border-[#da0e19] transition-all duration-300">
                      <FiArrowRight className="text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
