import React from "react";

// Import your icons from assets folder
import beachIcon from "../../assets/beach icon.png";
import heartIcon from "../../assets/heart.png";
import carIcon from "../../assets/car.png";
import flightIcon from "../../assets/flight.png";
import travelIllustration from "../../assets/travelillustration.png";
import hotelIcon from "../../assets/hotel.png";
import settingsIcon from "../../assets/settings.png";
import facebookIcon from "../../assets/icons/facebookicon.png";
import pinterestIcon from "../../assets/icons/printeresticon.png";
import whatsappIcon from "../../assets/icons/whatsappicon.png";
import instagramIcon from "../../assets/icons/instaicon.png";
import tiktokIcon from "../../assets/icons/tiktokicon.png";
import badgeIcon from "../../assets/badge.png"; // Add a badge/star icon for the featured package
import { useNavigate } from "react-router-dom";

interface PackageCardProps {
  icon: string;
  title: string;
  subtitle: string;
  tags: string[];
  price: string;
  duration: string;
  bgColor?: string;
  borderColor?: string; // add this
  scale?: string; // add this
}

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="text-center bg-white shadow-lg rounded-xl p-6 mx transition-transform hover:scale-105 max-w-50 mx-auto">
    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
      <img src={icon} alt={title} className="w-8 h-8" />
    </div>
    <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const TravelBookingSite: React.FC = () => {
  const navigate = useNavigate();

  const handleCustomizeClick = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/CustomPackageForm");
    } else {
      navigate("/login");
    }
  };
  const packages = [
    {
      icon: beachIcon,
      title: "East Coast Tropical Getaway",
      subtitle: "Beaches, Snorkeling & Culture",
      tags: ["Beach lovers", "couples", "Families"],
      price: "$25",
      duration: "5 Days",
      bgColor: "bg-white",
      borderColor: "border-gray-100",
      scale: "scale-100",
    },
    {
      icon: carIcon,
      title: "Safari + Beach Combo",
      subtitle: "Wildlife & Coastal Relaxation",
      tags: ["Families", "couples", "mixed-interest groups"],
      price: "$18",
      duration: "4 Days",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      scale: "md:scale-120",
    },
    {
      icon: heartIcon,
      title: "Luxury Honeymoon Retreat",
      subtitle: "Romance, Relaxation & Luxury",
      tags: ["Honeymooners", "special event", "anniversary couples"],
      price: "$39",
      duration: "5 Days",
      bgColor: "bg-white",
      borderColor: "border-gray-100",
      scale: "scale-100",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Best Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gray-500 mb-2">Our package</p>
            <h2 className="text-4xl font-bold text-gray-900">
              Our Best Packages
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 w-full">
            {packages.map((pkg, idx) => (
              <div
                key={pkg.title}
                className={`
                  relative
                  ${
                    idx === 1
                      ? "border-2 border-blue-400 bg-blue-50 scale-105 z-10 shadow-xl"
                      : "border border-gray-300 scale-95 bg-white"
                  }
                  rounded-2xl p-6 flex flex-col items-center transition-transform
                `}
                style={{ minHeight: 410 }}
              >
                {/* Badge for the middle card */}
                {idx === 1 && (
                  <img
                    src={badgeIcon}
                    alt="Featured"
                    className="absolute -top-6 left-1/2 -translate-x-5/2 w-10 h-10"
                  />
                )}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <img src={pkg.icon} alt={pkg.title} className="w-12 h-12" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 text-center mb-1">
                  {pkg.title}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  {pkg.subtitle}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {pkg.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="bg-blue-50 border border-blue-300 text-blue-600 px-3 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2 mt-auto">
                  <span className="text-sm text-gray-600">From</span>
                  <span className="text-lg font-bold text-gray-800">
                    {pkg.price}
                  </span>
                  <span className="text-sm text-gray-600">{pkg.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customize Package */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gray-500 mb-2">customize plan</p>
            <h2 className="text-4xl font-bold text-gray-900">
              customize your package
            </h2>
          </div>
          <div
            className="rounded-3xl p-8 shadow-lg border border-gray-300"
            style={{
              background: "linear-gradient(90deg, #fff 60%, #e9f6ff 100%)",
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex-1 w-full md:w-auto mb-8 md:mb-0">
                <img
                  src={travelIllustration}
                  alt="Travel Illustration"
                  className="w-full h-auto max-w-md mx-auto"
                />
              </div>
              <div className="flex-1 md:pl-8 w-full">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Customise Now
                </h3>
                <p className="text-gray-600 mb-6">
                  Customise your trip easily—choose places, dates, and
                  activities to create the perfect travel plan just for you.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/packages")}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600"
                  >
                    All packages
                  </button>
                  <button
                    onClick={handleCustomizeClick}
                    className="border border-blue-500 text-blue-500 px-6 py-3 rounded-lg font-medium hover:bg-blue-50"
                  >
                    Customized your plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gray-500 mb-2">CATEGORY</p>
            <h2 className="text-4xl font-bold text-gray-900">
              We Offer Best Services
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <ServiceCard
              icon={carIcon}
              title="Travelling Partner"
              description="Engrossed listening. Park gate sell they west hard for the."
            />
            <ServiceCard
              icon={flightIcon}
              title="Best Flights"
              description="Engrossed listening. Park gate sell they west hard for the."
            />
            <ServiceCard
              icon={hotelIcon}
              title="Hotel partner"
              description="Engrossed listening. Park gate sell they west hard for the."
            />
            <ServiceCard
              icon={settingsIcon}
              title="Customization"
              description="Engrossed listening. Park gate sell they west hard for the."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelBookingSite;
