import React, { useState } from "react";
import { FaHome, FaPlay } from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
import { FiX } from "react-icons/fi"; // ADDED: Close Icon for the modal
import { categories, solutionsData } from "../data/SolutionsPageData";

const Solutions = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedVideo, setSelectedVideo] = useState(null);

  const itemsPerPage = 6;

  const filteredSolutions =
    activeTab === "All"
      ? solutionsData
      : solutionsData.filter((solution) => solution.category === activeTab);

  const totalPages = Math.ceil(filteredSolutions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentSolutions = filteredSolutions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleTabChange = (category) => {
    setActiveTab(category);
    setCurrentPage(1);
  };

  const closeModal = () => setSelectedVideo(null);

  return (
    <div className="min-h-screen bg-white relative">
      <section className="relative w-full h-[300px] md:h-[400px] bg-gray-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80"
          alt="Keyboard"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute top-1/2 left-10 md:left-24 -translate-y-1/2 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
            Solutions
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-6 mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaHome className="text-[#da0e19] text-lg cursor-pointer" />
          <span className="cursor-pointer hover:text-[#da0e19]">Solutions</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto whitespace-nowrap pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleTabChange(category)}
              className={`pb-4 text-sm font-medium transition-colors duration-500 relative ${
                activeTab === category
                  ? "text-[#da0e19]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {category}
              <div
                className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#da0e19] transition-transform duration-500 ease-in-out origin-center ${
                  activeTab === category ? "scale-x-100" : "scale-x-0"
                }`}
              ></div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        {currentSolutions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {currentSolutions.map((solution) => (
              <div
                key={solution.id}
                className="group cursor-pointer flex flex-col"
                onClick={() => setSelectedVideo(solution)}
              >
                <div className="relative h-[220px] rounded-xl overflow-hidden shadow-lg mb-4">
                  <img
                    src={solution.img}
                    alt={solution.imageTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute top-4 left-4 text-white text-xs font-bold tracking-wider z-10">
                    <span className="italic font-extrabold mr-1">HCFA</span> |
                    Industrial Insights
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors">
                      <FaPlay className="text-white text-lg ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-10 left-4 right-4 z-10">
                    <p className="text-gray-200 text-[10px] mb-1">
                      {solution.imageText}
                    </p>
                    <p className="text-white font-bold text-sm leading-tight">
                      {solution.imageTitle}
                    </p>
                  </div>
                </div>
                <h3
                  className={`text-[1.05rem] font-bold leading-snug px-1 text-gray-800 group-hover:text-[#da0e19] transition-colors"}`}
                >
                  {solution.title}
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No solutions found for this category.
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 pb-20">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-8 h-8 flex items-center justify-center transition-colors ${
                currentPage === index + 1
                  ? "border-b-2 border-[#da0e19] text-[#da0e19] font-medium"
                  : "text-gray-400 hover:text-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center transition-colors ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#da0e19] hover:text-[#da0e19]"
            }`}
          >
            <HiOutlineArrowRight className="text-xl" />
          </button>
        </div>
      )}

      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={closeModal}
          ></div>

          <div className="relative w-full max-w-5xl bg-black rounded-lg shadow-2xl overflow-hidden z-10">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 text-white hover:text-[#da0e19] bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all"
            >
              <FiX className="text-2xl" />
            </button>

            <video
              src={
                selectedVideo.videoUrl ||
                "https://www.w3schools.com/html/mov_bbb.mp4"
              }
              controls
              autoPlay
              className="w-full h-auto aspect-video outline-none"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solutions;
