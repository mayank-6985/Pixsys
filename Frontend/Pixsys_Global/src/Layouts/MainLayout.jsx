import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import MouseTracker from "../components/MouseTracker";
import ScrollToTop from "../components/ScrollToTop";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f3f4] text-base-text font-sans antialiased">
      {/* <MouseTracker/> */}
      <Header />  
      <ScrollToTop/>
      <main className="flex-grow w-full flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
