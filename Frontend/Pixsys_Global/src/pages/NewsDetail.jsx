import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaHome, FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // X icon
import { TbGridDots } from "react-icons/tb"; // 9-dots icon
import { IoIosArrowBack } from "react-icons/io";

// --- MOCK DATA ---
const mockArticle = {
  id: 1,
  date: "2026-01-26 17:36:10",
  title: "HCFA India Platinum & Gold Partners Meet 2026, Longyou China",
  image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
  content: [
    "In January 2026, HCFA Global successfully hosted the HCFA India Platinum and Gold Partners Meet at HCFA Headquarters at Longyou China, bringing together our key partners for an intensive three-day strategic engagement. The meet marked an important milestone in strengthening collaboration and aligning our collective roadmap for HCFA India's growth in 2026.",
    "During the event, we shared and discussed business strategies, market focus areas, Niche Segment, Benchmark Industries, and expansion plans for the year ahead. Partners were given an exclusive opportunity to visit the HCFA manufacturing facility, where they experienced our advanced factory infrastructure and assembly lines for Servo Drives & Motors, HMI, PLC, and VFD—reinforcing HCFA's commitment to quality, precision, and innovation.",
    "A major highlight of the meet was the introduction of HCFA Vision Systems. This new addition to our portfolio was presented in detail, showcasing its capabilities, application possibilities, and strong potential for the Indian automation market.",
    "The three-day format allowed for in-depth, face-to-face interactions with every partner. These personalized discussions helped us gain valuable insights into market challenges, customer expectations, and specific requirements of Indian partners, enabling HCFA to align products, solutions, and support more effectively.",
    "Overall, the HCFA India Platinum & Gold Partners Meet 2026 was a highly successful and impactful event, strengthening partnerships, building trust, and setting a clear, collaborative direction for sustainable growth in the Indian industrial automation market."
  ]
};

const NewsDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20">
      
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="flex items-center gap-1 hover:text-gray-800 transition-colors">
              <FaHome className="text-[#da0f1a] text-lg" />
            </Link>
            <span>News</span>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-800">News</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          <div className="flex-shrink-0">
            <button 
              onClick={() => navigate('/news')} 
              className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#da0f1a] to-[#c9c9c9] text-white flex flex-col items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <TbGridDots className="text-3xl mb-1" />
              <span className="text-xs font-medium">Back</span>
            </button>
          </div>

          <div className="flex-1 max-w-4xl">
            
            <h1 className="text-3xl md:text-4xl font-normal text-gray-900 mb-6 leading-tight">
              {mockArticle.title}
            </h1>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="text-gray-400 text-sm">
                {mockArticle.date}
              </div>
              
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 rounded-full border border-[#da0f1a] text-[#da0f1a] flex items-center justify-center hover:bg-[#da0f1a] hover:text-white transition-colors">
                  <FaLinkedinIn size={14} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-[#da0f1a] text-[#da0f1a] flex items-center justify-center hover:bg-[#da0f1a] hover:text-white transition-colors">
                  <FaFacebookF size={14} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-[#da0f1a] text-[#da0f1a] flex items-center justify-center hover:bg-[#da0f1a] hover:text-white transition-colors">
                  <FaXTwitter size={14} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-[#da0f1a] text-[#da0f1a] flex items-center justify-center hover:bg-[#da0f1a] hover:text-white transition-colors">
                  <FaInstagram size={14} />
                </a>
              </div>
            </div>

            <div className="w-full mb-10 rounded-sm overflow-hidden">
              <img 
                src={mockArticle.image} 
                alt="Featured" 
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="space-y-6 text-gray-500 leading-relaxed text-[15px]">
              {mockArticle.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100">
              <button className="flex items-center gap-2 bg-gray-300 text-white px-6 py-2 rounded shadow-sm cursor-not-allowed">
                <IoIosArrowBack />
                <span className="text-sm font-medium">Prev</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;