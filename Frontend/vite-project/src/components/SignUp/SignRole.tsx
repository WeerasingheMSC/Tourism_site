// src/pages/SignupLandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const SignupLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-blue-600 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-10 left-10 w-28 h-28 bg-white rounded-full opacity-20 animate-bounce" style={{ animationDuration: "3s" }}></div>
      <div className="absolute bottom-20 right-12 w-20 h-20 bg-white rounded-full opacity-15 animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white rounded-full opacity-10 animate-pulse" style={{ animationDuration: "5s" }}></div>

      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-sky-400/20 p-10 lg:p-16 flex flex-col lg:flex-row gap-12">
        {/* Left panel */}
        <div className="flex-1 flex flex-col justify-center space-y-8 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
            Join Our Community
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto lg:mx-0">
            Whether you’re traveling the world or running a business, we’ve got you covered. Sign up today to start your journey!
          </p>

          <button
            onClick={() => navigate("/register")}
            className="mx-auto lg:mx-0 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:shadow-sky-400/40 hover:-translate-y-1 transition-transform duration-300"
          >
            Sign Up As a Traveler
          </button>
        </div>

        {/* Right panel (business registration) */}
        <div className="flex-1 bg-sky-50 rounded-2xl p-8 flex flex-col justify-center shadow-inner shadow-sky-200 border border-sky-300">
          <h2 className="text-2xl font-semibold text-sky-700 mb-6 text-center">
            Business Registration
          </h2>
          <p className="text-sky-600 text-center mb-10 max-w-sm mx-auto">
            Register your hotel or transport service to expand your reach and grow your business.
          </p>

          <div className="flex flex-col gap-6">
            <button
              onClick={() => navigate("/signup/business/hotel")}
              className="w-full bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-sky-400/40 hover:-translate-y-1 transition-transform duration-300"
            >
              Register Your Hotel
            </button>

            <button
              onClick={() => navigate("/signup/business/transport")}
              className="w-full bg-gradient-to-r from-blue-600 to-sky-400 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-blue-400/40 hover:-translate-y-1 transition-transform duration-300"
            >
              Register Your Transport Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupLandingPage;
