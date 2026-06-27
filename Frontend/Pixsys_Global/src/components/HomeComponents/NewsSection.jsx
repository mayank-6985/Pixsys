import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import ScrollReveal from "../ScrollReveal";
import { useNews } from "../../hooks/useNews";

const NewsSection = () => {
  const { data: backendNews = [], isLoading, isError } = useNews();
  const latestNews = Array.isArray(backendNews)
    ? [...backendNews]
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 3)
    : [];

  return (
    <section className="bg-white py-24 lg:py-32 border-t border-zinc-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5 flex flex-col">
            <ScrollReveal direction="up">
              <div className="mb-12">
                <h2 className="text-sm font-bold text-[#da0e19] uppercase tracking-[0.2em] mb-4">
                  Corporate Newsroom
                </h2>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 uppercase tracking-tight leading-[1.1]">
                  Latest Updates
                </h3>
              </div>
            </ScrollReveal>

            <div className="flex flex-col border-t-2 border-zinc-900">
              {isLoading ? (
                <div className="py-8 text-zinc-500 font-medium">
                  Loading latest news...
                </div>
              ) : isError ? (
                <div className="py-8 text-red-500">
                  Unable to load news at this time.
                </div>
              ) : (
                latestNews.map((item, index) => (
                  <ScrollReveal
                    key={item.news_id}
                    delay={index * 100}
                    direction="up"
                  >
                    <Link
                      to={`/news/${item.news_id}`}
                      className="group flex flex-col py-8 border-b border-zinc-200 hover:border-[#da0e19] transition-colors duration-300"
                    >
                      <div className="flex justify-between items-start gap-6">
                        <div>
                          <span className="font-mono text-xs font-bold text-zinc-400 tracking-widest mb-3 block">
                            {item.date?.replace(/-/g, ".")}
                          </span>
                          <h4 className="text-xl font-bold text-zinc-900 group-hover:text-[#da0e19] transition-colors duration-300 leading-snug">
                            {item.heading}
                          </h4>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-[#da0e19] group-hover:border-[#da0e19] transition-all duration-300 shrink-0">
                          <FiArrowRight className="text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))
              )}
            </div>

            <ScrollReveal direction="up" delay={300}>
              <div className="mt-12">
                <Link
                  to="/news"
                  className="group inline-flex items-center gap-4 pb-2 border-b-2 border-zinc-300 hover:border-[#da0e19] transition-colors duration-300"
                >
                  <span className="text-sm font-bold text-zinc-900 uppercase tracking-widest group-hover:text-[#da0e19] transition-colors">
                    Read All News
                  </span>
                  <FiArrowRight className="text-xl text-zinc-900 group-hover:text-[#da0e19] group-hover:translate-x-2 transition-all duration-300" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7 hidden lg:flex flex-col gap-6 mt-16 lg:mt-0">
            <ScrollReveal
              direction="up"
              delay={200}
              className="w-full h-[300px] md:h-[400px] lg:h-[450px]"
            >
              <Link
                to={latestNews[0] ? `/news/${latestNews[0].news_id}` : "/news"}
                className="w-full h-full relative overflow-hidden bg-zinc-100 group block rounded-sm"
              >
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img
                  src={latestNews[0]?.thumbnail}
                  alt={latestNews[0]?.heading || "Latest News Main"}
                  className="w-full h-full object-fit transform group-hover:scale-105 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                />
              </Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ScrollReveal
                direction="up"
                delay={300}
                className="w-full h-[250px]"
              >
                <Link
                  to={
                    latestNews[1] ? `/news/${latestNews[1].news_id}` : "/news"
                  }
                  className="w-full h-full relative overflow-hidden bg-zinc-100 group block rounded-sm"
                >
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img
                    src={latestNews[1]?.thumbnail}
                    alt={latestNews[1]?.heading || "Latest News Side"}
                    className="w-full h-full object-fir transform group-hover:scale-105 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                  />
                </Link>
              </ScrollReveal>

              <ScrollReveal
                direction="up"
                delay={400}
                className="w-full h-[250px]"
              >
                <Link
                  to={
                    latestNews[2] ? `/news/${latestNews[2].news_id}` : "/news"
                  }
                  className="w-full h-full relative overflow-hidden bg-zinc-100 group block rounded-sm"
                >
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img
                    src={latestNews[2]?.thumbnail}
                    alt={latestNews[2]?.heading || "Latest News Side"}
                    className="w-full h-full object-fit transform group-hover:scale-105 transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                  />
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
