// src/pages/Hero.tsx
import React from "react";
import Decore from "../../assets/Decore.png";
import { Button } from "antd";
import Traveller from "../../assets/Traveller 1.png";
import Plane from "../../assets/plane.png";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  // 👇 guard for Customize Package: if not logged in, go to /login
  const handleCustomizeClick = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/CustomPackageForm");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="pb-1">
      <div className="relative bg-gray-200 lg:bg-white box-border border-gray-300  lg:border-none lg:shadow-none">
        {/* Desktop Images */}
        <img src={Decore} alt="" className="absolute right-0 hidden lg:flex" />
        <img
          src={Traveller}
          alt=""
          className="absolute right-0 w-160 h-auto mt-25 mr-35 lg:flex z-40 hidden"
        />
        <img
          src={Plane}
          alt=""
          className="absolute right-0 w-30 h-auto mt-50 mr-35 hidden lg:flex"
        />
        <img
          src={Plane}
          alt=""
          className="absolute right-0 w-30 h-auto mt-40 mr-160 hidden lg:flex"
        />

        {/* Mobile/Tablet Background Images */}
        <div className="lg:hidden absolute inset-0 overflow-hidden">
          {/* Beautiful blue gradient background with enhanced depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-gray-50 z-1"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-blue-100/30 z-2"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent z-2"></div>
          
          {/* Traveller image as subtle background */}
          <div className="absolute bottom-0 right-0 w-3/4 sm:w-2/3 md:w-1/2 h-4/5 sm:h-full md:h-full z-3">
            <img
              src={Traveller}
              alt=""
              className="absolute bottom-0 right-0 w-full h-full object-contain object-bottom-right opacity-15 filter brightness-120 saturate-108 contrast-102"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-50/5 to-blue-100/8"></div>
          </div>
          
          {/* Enhanced floating cloud elements */}
          <div className="absolute top-16 left-6 w-24 h-24 bg-white/20 blur-2xl animate-pulse opacity-60 z-4" style={{animationDuration: '7s'}}></div>
          <div className="absolute bottom-28 right-6 w-20 h-20 bg-blue-200/25 blur-xl animate-pulse opacity-50 z-4" style={{animationDuration: '9s', animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 left-12 w-18 h-18 bg-white/15 blur-xl animate-pulse opacity-45 z-4" style={{animationDuration: '8s', animationDelay: '5s'}}></div>
          
          {/* Tourism-themed floating icons */}
          <div className="absolute top-20 left-20 w-6 h-6 bg-gradient-to-br from-orange-300/40 to-amber-400/30 blur-sm animate-bounce opacity-65 z-5 shadow-sm" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-36 left-16 w-5 h-5 bg-gradient-to-br from-teal-300/40 to-cyan-400/30 blur-sm animate-bounce opacity-60 z-5 shadow-sm" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
          <div className="absolute top-36 right-20 w-4 h-4 bg-gradient-to-br from-pink-300/40 to-rose-400/30 blur-sm animate-bounce opacity-55 z-5 shadow-sm" style={{animationDuration: '7s', animationDelay: '3s'}}></div>
          
          {/* Enhanced plane elements with dynamic trails */}
          <div className="absolute top-20 right-12 z-6">
            <div className="absolute -left-8 top-1.5 w-12 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-blue-300/30 opacity-70 blur-[0.5px]"></div>
            <div className="absolute -left-6 top-1 w-8 h-0.3 bg-gradient-to-r from-transparent to-white/50"></div>
            <img
              src={Plane}
              alt=""
              className="w-8 sm:w-10 h-auto opacity-45 filter brightness-115 saturate-110 drop-shadow-sm hover:opacity-70 hover:scale-110 transition-all duration-400"
            />
          </div>
          
          <div className="absolute top-36 right-24 z-6">
            <div className="absolute -left-6 top-1.5 w-10 h-0.5 bg-gradient-to-r from-transparent via-blue-300/40 to-white/25 opacity-60 blur-[0.5px]"></div>
            <div className="absolute -left-4 top-1 w-6 h-0.3 bg-gradient-to-r from-transparent to-blue-300/50"></div>
            <img
              src={Plane}
              alt=""
              className="w-6 sm:w-8 h-auto opacity-40 filter brightness-115 saturate-110 drop-shadow-sm hover:opacity-60 hover:scale-110 transition-all duration-400"
            />
          </div>
          
          {/* Decorative sparkle particles */}
          <div className="absolute top-28 left-28 w-2 h-2 bg-white/60 blur-sm animate-pulse opacity-70 z-6 shadow-sm" style={{animationDuration: '4s'}}></div>
          <div className="absolute bottom-32 left-24 w-1.5 h-1.5 bg-blue-400/70 blur-sm animate-pulse opacity-65 z-6 shadow-sm" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
          <div className="absolute top-44 right-16 w-1.5 h-1.5 bg-white/55 blur-sm animate-pulse opacity-60 z-6 shadow-sm" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-48 right-32 w-1 h-1 bg-blue-300/60 blur-sm animate-pulse opacity-55 z-6 shadow-sm" style={{animationDuration: '4.5s', animationDelay: '3s'}}></div>
          <div className="absolute top-52 left-32 w-1 h-1 bg-white/50 blur-sm animate-pulse opacity-50 z-6 shadow-sm" style={{animationDuration: '5.5s', animationDelay: '1.5s'}}></div>
          
          {/* Subtle geometric patterns */}
          <div className="absolute top-12 right-8 w-3 h-3 border border-white/25 opacity-40 animate-pulse z-5" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-16 left-8 w-2.5 h-2.5 border border-blue-300/30 opacity-35 animate-pulse z-5" style={{animationDuration: '7s', animationDelay: '4s'}}></div>
          
          {/* Dynamic floating elements with better UX */}
          <div className="absolute top-32 left-36 w-4 h-4 bg-gradient-to-br from-orange-200/30 to-amber-300/25 opacity-50 animate-bounce z-5 shadow-sm hover:opacity-70 transition-opacity duration-300" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-28 w-3.5 h-3.5 bg-gradient-to-br from-blue-200/30 to-cyan-300/25 opacity-45 animate-bounce z-5 shadow-sm hover:opacity-65 transition-opacity duration-300" style={{animationDuration: '7s', animationDelay: '2s'}}></div>
          <div className="absolute top-48 right-28 w-3 h-3 bg-gradient-to-br from-teal-200/30 to-emerald-300/25 opacity-40 animate-bounce z-5 shadow-sm hover:opacity-60 transition-opacity duration-300" style={{animationDuration: '8s', animationDelay: '3s'}}></div>
          
          {/* Enhanced depth overlay with texture */}
          <div className="absolute inset-0 bg-white/[0.08] backdrop-blur-[0.5px] z-7"></div>
          
          {/* Subtle edge glow effects */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-200/40 via-white/30 to-blue-200/40 opacity-60 z-8"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 via-blue-200/40 to-white/30 opacity-50 z-8"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:pl-24 pt-20 sm:pt-28 md:pt-32 lg:pt-40 pb-20">
          {/* Subtitle */}
          <p
            className="text-orange-600 text-xs sm:text-sm md:text-base lg:text-lg 
                        font-extrabold font-popins text-center lg:text-start 
                        mb-4 sm:mb-6 md:mb-8"
          >
            BEST DESTINATION AROUND SRI LANKA
          </p>

          {/* Main Title */}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl 
                         font-extrabold mt-4 sm:mt-6 md:mt-8 text-center lg:text-start 
                         leading-tight sm:leading-tight md:leading-tight lg:leading-tight
                         max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:w-110
                         mx-auto lg:mx-0"
            style={{ fontFamily: "sans-serif" }}
          >
            Travel, enjoy and live a new and full life
          </h1>

          {/* Description */}
          <p
            className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:w-110 
                        text-sm sm:text-base md:text-lg 
                        text-center lg:text-start 
                        font-sans mt-4 sm:mt-6 md:mt-8 
                        mx-auto lg:mx-0 
                        leading-relaxed text-gray-700"
          >
            Built Wicket longer admire do barton vanity itself do in it.
            Preferred to sportsmen it engrossed listening. Park gate sell they
            west hard for the.
          </p>

          {/* Buttons */}
          <div
            className="mt-8 sm:mt-10 md:mt-12 
                          flex flex-col sm:flex-row 
                          items-center lg:items-start 
                          justify-center lg:justify-start 
                          gap-4 sm:gap-2 md:gap-4"
          >
            <Button
              type="primary"
              className="w-42"
              onClick={() => navigate("/packages")}
              style={{
                height: 40,
                minWidth: 140,
                fontSize: "14px",
                background: "#0288D1",
              }}
              size="large"
            >
              Find Out More
            </Button>
            {/* 🔄 2) Redirect to home (/) on click */}
            <Button
              onClick={handleCustomizeClick}
              className="w-full sm:w-auto"
              style={{
                height: 40,
                width: "auto",
                minWidth: 160,
                fontSize: "14px",
              }}
              size="large"
            >
              Customize your plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
