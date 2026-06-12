import React, { useEffect, useRef } from "react";

export default function MouseTracker() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        // e.clientX and e.clientY get the exact mouse coordinates.
        // We subtract 16px to perfectly center the 32px (w-8 h-8) ring on the tip of the mouse.
        cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
      }
    };

    // Attach the listener to the whole window
    window.addEventListener("mousemove", moveCursor);

    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary bg-primary/10 pointer-events-none z-[10000] transition-transform duration-100 ease-out hidden md:block"
    />
  );
}