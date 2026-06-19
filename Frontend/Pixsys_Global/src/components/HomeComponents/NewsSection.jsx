import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { newsData } from "../../data/homeData";
import ScrollReveal from "../ScrollReveal";
const NewsSection = () => {
  return (
    <section className="bg-[#f8f9fa] py-20 px-6 md:px-12 border-t border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <ScrollReveal direction="up">
            <h3 className="text-4xl font-black text-zinc-900 uppercase tracking-tight mb-12">
              Latest News
            </h3>
          </ScrollReveal>

          <div className="flex flex-col border-t border-zinc-300">
            {newsData.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 150} direction="up">
                <div className="py-6 border-b border-zinc-300 group">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-2 h-2 bg-[#da0e19] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-xs font-mono font-bold text-zinc-500 tracking-widest">
                      {item.date}
                    </span>
                  </div>

                  <a href={item.link} className="block pl-6">
                    <h4 className="text-lg font-bold text-zinc-900 group-hover:text-[#da0e19] transition-colors duration-300">
                      {item.title}
                    </h4>
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={400}>
            <div className="mt-8">
              <button className=" group px-6 py-3 bg-zinc-900 text-white uppercase tracking-wider text-sm font-bold hover:bg-[#da0e19] transition-colors duration-300 flex items-center gap-3">
               Read News<FiArrowRight className="text-lg ml-2 group-hover:translate-x-2 transition-transform duration-300" />{" "}
              </button>
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-7 hidden lg:grid grid-cols-2 gap-4">
          <ScrollReveal direction="right" className="col-span-2">
            <div className="h-[300px] bg-zinc-200 relative group overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80"
                alt="Conference Main"
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200} className="w-full h-full">
            <div className="h-[250px] bg-zinc-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80"
                alt="Conference Side"
                className="w-full h-full object-cover grayscale-[50%]"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400} className="w-full h-full">
            <div className="h-[250px] bg-zinc-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80"
                alt="Exhibition Booth"
                className="w-full h-full object-cover grayscale-[50%]"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
