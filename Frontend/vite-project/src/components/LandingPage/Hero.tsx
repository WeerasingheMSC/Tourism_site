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
      <div className="relative bg-gray-200 lg:bg-white overflow-hidden box-border border-gray-300 rounded-lg shadow-lg lg:border-none lg:shadow-none">
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
        <div className="lg:hidden absolute inset-0 opacity-20">
          <img
            src={Traveller}
            alt=""
            className="absolute right-2 top-10 w-32 hidden lg:flex sm:w-40 md:w-48 h-auto"
          />
          <img
            src={Plane}
            alt=""
            className="absolute right-4 top-20 w-8 sm:w-10 md:w-12 h-auto opacity-40"
          />
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
