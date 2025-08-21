import React, { useState, useEffect } from "react";

// Import your icons from assets folder
import beachIcon from "../../assets/beach icon.png";
import carIcon from "../../assets/car.png";
import travelIllustration from "../../assets/travelillustration.png";
import hotelIcon from "../../assets/hotel.png";
import settingsIcon from "../../assets/settings.png";
import badgeIcon from "../../assets/badge.png";
import { useNavigate } from "react-router-dom";

// Import the API function
import { getPackages } from "../../api/packages";

interface PackageType {
  _id: string;
  name: string; // maps to title
  theme: string; // maps to subtitle
  idealFor: string[]; // maps to tags
  packageIcon: string; // maps to image URL
  startingPrice: string; // e.g. "1200 USD"
  dailyPlans: any[]; // for duration count
}

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  link?: string;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  link,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      // Handle different types of links
      if (link.startsWith('/')) {
        // Internal route - use navigate
        navigate(link);
      } else if (link.startsWith('http')) {
        // External link - open in same tab but use window.location for SPA compatibility
        window.location.href = link;
      } else {
        // Relative path - treat as internal route
        navigate(`/${link}`);
      }
    }
  };

  const CardContent = () => (
    <div 
      className="text-center bg-white shadow-lg rounded-xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer border border-gray-100 hover:border-blue-200"
      onClick={handleClick}
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shadow-md group-hover:shadow-lg">
        <img src={icon} alt={title} className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <h3 className="font-bold text-gray-800 mb-3 text-base sm:text-lg group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{description}</p>
      {(link || onClick) && (
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-blue-500 text-sm font-medium">Learn More →</span>
        </div>
      )}
    </div>
  );

  return <CardContent />;
};

const TravelBookingSite: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 👇 guard for Customize Package: if not logged in, go to /login
  const handleCustomizeClick = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/CustomPackageForm");
    } else {
      navigate("/login");
    }
  };

  // Fetch packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPackages();
        setPackages(response.data);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError('Failed to load packages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Get top 3 packages for display (you can modify this logic)
  const displayPackages = packages.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Best Packages */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-gray-500 mb-2 text-sm sm:text-base">Our package</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Our Best Packages
            </h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col sm:flex-row justify-center items-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
              <span className="mt-2 sm:mt-0 sm:ml-3 text-gray-600 text-sm sm:text-base">Loading packages...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8 sm:py-12">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block text-sm sm:text-base">
                {error}
              </div>
            </div>
          )}

          {/* Packages Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
              {displayPackages.length === 0 ? (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <p className="text-gray-500 text-sm sm:text-base">No packages available at the moment.</p>
                </div>
              ) : (
                displayPackages.map((pkg, idx) => (
                  <div
                    key={pkg._id}
                    className={`
                      relative w-full
                      ${
                        idx === 1
                          ? "border-2 border-blue-400 bg-blue-50 lg:scale-105 z-10 shadow-xl"
                          : "border border-gray-300 lg:scale-95 bg-white"
                      }
                      rounded-2xl p-4 sm:p-6 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-xl
                    `}
                    style={{ minHeight: 'auto' }}
                  >
                    {/* Badge for the middle card */}
                    {idx === 1 && (
                      <img
                        src={badgeIcon}
                        alt="Featured"
                        className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10"
                      />
                    )}
                    
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <img 
                          src={pkg.packageIcon || beachIcon} 
                          alt={pkg.name} 
                          className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover" 
                        />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 text-center mb-1 text-sm sm:text-base lg:text-lg">
                      {pkg.name}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4 px-2">
                      {pkg.theme}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mb-3 sm:mb-4 px-2">
                      {pkg.idealFor?.slice(0, 3).map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="bg-blue-50 border border-blue-300 text-blue-600 px-2 sm:px-3 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {pkg.idealFor?.length > 3 && (
                        <span className="text-xs text-gray-400 px-2 py-1">
                          +{pkg.idealFor.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mt-auto">
                      <span className="text-xs sm:text-sm text-gray-600">From</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-800">
                        {pkg.startingPrice}$
                      </span>
                      <span className="text-xs sm:text-sm text-gray-600">
                        {pkg.dailyPlans?.length || 0} Days
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Customize Package */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-gray-500 mb-2 text-sm sm:text-base">customize plan</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Customize your package
            </h2>
          </div>
          <div
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-300"
            style={{
              background: "linear-gradient(90deg, #fff 60%, #e9f6ff 100%)",
            }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
              <div className="flex-1 w-full lg:w-auto order-2 lg:order-1">
                <img
                  src={travelIllustration}
                  alt="Travel Illustration"
                  className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md mx-auto"
                />
              </div>
              <div className="flex-1 w-full order-1 lg:order-2 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Customize Now
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                  Customize your trip easily—choose places, dates, and
                  activities to create the perfect travel plan just for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => navigate("/packages")}
                    className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300 text-sm sm:text-base"
                  >
                    All packages
                  </button>
                  <button
                    onClick={handleCustomizeClick}
                    className="border border-blue-500 text-blue-500 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-300 text-sm sm:text-base"
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
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-gray-500 mb-2 text-sm sm:text-base">CATEGORY</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              We Offer Best Services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <ServiceCard
              icon={carIcon}
              title="Travelling Partner"
              description="Explore Sri Lanka with our reliable vehicle booking service. Choose from a wide range of cars and experienced drivers."
              link="/vehicles"
            />
            <ServiceCard
              icon={hotelIcon}
              title="Hotel partner"
              description="Discover comfortable accommodations across Sri Lanka. Book the perfect hotel for your stay with our trusted partners."
              link="/hotels"
            />
            <ServiceCard
              icon={settingsIcon}
              title="Customization"
              description="Create your perfect Sri Lankan adventure. Customize every detail of your trip to match your preferences and dreams."
              onClick={() => {
                const token = localStorage.getItem("authToken");
                if (token) {
                  navigate("/CustomPackageForm");
                } else {
                  navigate("/login");
                }
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelBookingSite;