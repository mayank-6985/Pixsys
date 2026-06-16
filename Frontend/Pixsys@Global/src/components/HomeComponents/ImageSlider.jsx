import React, { useState, useEffect } from "react";

const ImageSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
  
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[75vh] overflow-hidden group bg-gray-100 ">
      
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"></div>

      <div
        className="flex w-full h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover shrink-0 min-w-full"
          />
        ))}
      </div>
      
    </div>
  );
};

export default ImageSlider;