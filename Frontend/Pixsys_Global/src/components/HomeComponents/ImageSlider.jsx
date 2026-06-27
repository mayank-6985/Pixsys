import React, { useState, useEffect } from "react";
import { useHome } from "../../hooks/useHome";

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const { data: imageData, isLoading } = useHome();

  const validImageArray = Array.isArray(imageData)
    ? imageData
    : imageData?.slideImages || [];

  const slides = validImageArray.map((url, index) => ({
    id: index,
    image: url,
  }));
  useEffect(() => {
    if (!slides || slides.length === 0 || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isDragging, currentIndex]);

  if (isLoading || slides.length === 0) {
    return (
      <div className="w-full h-[50vh] md:h-[60vh] lg:h-[75vh] bg-zinc-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-[#da0e19]"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            Loading Slider...
          </span>
        </div>
      </div>
    );
  }
  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.type.includes("mouse") ? e.pageX : e.touches[0].clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    const offset = currentX - startX;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    setIsDragging(false);

    if (dragOffset > 100) {
      setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    } else if (dragOffset < -100) {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }

    setDragOffset(0);
  };

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[75vh] overflow-hidden bg-zinc-900 group select-none">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] z-10 pointer-events-none"></div>

      <div
        className={`flex w-full h-full cursor-grab active:cursor-grabbing ${
          isDragging
            ? "transition-none"
            : "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        }`}
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className="w-full h-full shrink-0 min-w-full relative"
          >
            <div className="absolute inset-0 bg-black/40 z-0"></div>
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-fit grayscale-[20%] pointer-events-none"
              draggable="false"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group/btn h-8 flex items-center justify-center cursor-pointer"
          >
            <div
              className={`h-[3px] transition-all duration-500 ease-out ${
                currentIndex === index
                  ? "w-12 bg-[#da0e19]"
                  : "w-6 bg-white/30 group-hover/btn:bg-white/70 group-hover/btn:w-8"
              }`}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
