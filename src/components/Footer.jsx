import React from "react";
import { Outlet, Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { ImInstagram } from "react-icons/im";


const Footer = () => {
  return (
    <footer className="w-full bg-[#111c2a] text-gray-300 border-t-2 border-primary  rounded-md">
      <div className="w-full max-w-md mx-auto px-6 py-6">
        <div>
          <Link
            to="/"
            className="text-4xl font-extrabold italic tracking-tighter text-primary focus:outline-none"
          >
            SHIVVILON <span className="text-xl text-slate-300 tracking-normal">Solutions</span>
          </Link>
        </div>
        <hr className="border-t border-primary w-full my-4 opacity-80" />
        <div className="flex gap-4 mb-6 ">
          <a
            href="#"
            className="w-11 h-11 rounded-full bg-slate-700 text-primary flex items-center justify-center text-xl font-bold hover:bg-slate-600 transition-colors"
          >
            <FaLinkedinIn color=""/>
          </a>
          <a
            href="#"
            className="w-11 h-11 rounded-full bg-slate-700 text-primary flex items-center justify-center text-xl font-bold hover:bg-gray-600 transition-colors"
          >
            <FaFacebookF color=""/>
          </a>
           <a
            href="#"
            className="w-11 h-11 rounded-full bg-slate-700 text-primary flex items-center justify-center text-xl font-bold hover:bg-gray-600 transition-colors"
          >
            <FaYoutube color=""/>
          </a>
           <a
            href="#"
            className="w-11 h-11 rounded-full bg-slate-700 text-primary flex items-center justify-center text-xl font-bold hover:bg-gray-600 transition-colors"
          >
            <FaInstagram color=""/>
          </a>
        </div>

        <div className="text-xs text-gray-400 leading-relaxed">
          <p>COPYRIGHT &copy; Shivvilon-Solutions Rights Reserved</p>
        </div>
      </div>

      
    </footer>
  );
};

export default Footer;
