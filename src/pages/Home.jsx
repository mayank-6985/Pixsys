import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <section className="relative w-full bg-offwhite flex items-center pt-12 pb-24 md:pt-24 md:pb-32 overflow-hidden">
      
      {/* Background Decorative Element (Hidden on mobile for performance) */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none hidden md:block"></div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* 1. Text Content (Left Side) */}
        <div className="flex-1 text-center lg:text-left">
          
          {/* Eyebrow badge */}
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-red-100 text-primary font-bold text-xs tracking-widest uppercase">
            New Productivity Frontiers
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-base-text tracking-tight mb-6 leading-[1.1]">
            Advance <span className="text-primary italic">Smart</span><br />
            Manufacturing
          </h1>
          
          {/* Subtext */}
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
            Empowering global industries with high-performance control technology, servo systems, and intelligent automation solutions.
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link 
              to="/products" 
              className="w-full sm:w-auto px-8 py-4 bg-red-100 text-slate-800 font-bold rounded hover:bg-red-700 hover:text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-center"
            >
              Explore Products
            </Link>
            <Link 
              to="/solutions" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-base-text font-bold rounded shadow-sm border border-gray-200 hover:border-primary hover:text-primary transition-all duration-300 text-center"
            >
              View Solutions
            </Link>
          </div>
        </div>

        {/* 2. Visual Placeholder (Right Side) */}
        <div className="flex-1 w-full relative max-w-xl mx-auto lg:max-w-none">
          
          {/* Main Image Container */}
          <div className="aspect-square sm:aspect-[4/3] bg-gray-200 rounded-2xl border border-gray-300 shadow-2xl overflow-hidden relative group">
             {/* Hover Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"></div>
            
            {/* Replace this div with an actual <img /> when you have your assets */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium bg-gray-100">
              [ Industrial Automation Render ]
            </div>
          </div>

          {/* Floating Accent Badge (Adds depth, hidden on tiny screens) */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden sm:flex items-center gap-4 animate-[bounce_3s_ease-in-out_infinite]">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-primary text-2xl">
              ⚙️
            </div>
            <div className="text-left">
              <div className="font-extrabold text-base-text text-sm">High Precision</div>
              <div className="text-xs text-gray-500 font-medium">Motion Control</div>
            </div>
          </div>
          
        </div>

      </div>
    </section>
    </div>
  )
}

export default Home