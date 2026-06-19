import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const SomethingWentWrong = ({ error, resetErrorBoundary }) => {
  // If no specific reset function is passed, default to refreshing the page
  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-6 bg-[#fafafa]">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center md:p-10">
        
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertCircle className="text-4xl text-[#da0e19]" />
        </div>
        
        {/* Text Content */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          {error?.message || 
            "We encountered an unexpected error while trying to load this page. Please try again or return to the homepage."}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleReload}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#da0e19] text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-[#da0e19] transition-colors"
          >
            Back to Home
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default SomethingWentWrong;