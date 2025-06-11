// src/pages/TravelPackagesPage.tsx
import React, { useState, useEffect } from "react";
import PackageCard from "../../components/Packages/PackageCard.tsx";
import Decore from "../../components/Packages/Decore.tsx";
import { getPackages } from "../../api/packages.ts";

interface PackageType {
  _id: string;
  name: string; // maps to title
  theme: string; // maps to subtitle
  idealFor: string[]; // maps to tags
  packageIcon: string; // maps to image URL
  startingPrice: string; // e.g. "1200 USD"
  dailyPlans: any[]; // for duration count
}

const TravelPackagesPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch packages from backend once on mount
  useEffect(() => {
    getPackages()
      .then((res) => setPackages(res.data))
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      });
  }, []);

  const filters = [
    "All packages",
    "Beach",
    "Honeymoon",
    "Couple",
    "Religious",
    "Pilgrims",
    "Wild Life",
    "Hills",
  ];

  // Toggle filter state
  const handleFilterClick = (filter: string) => {
    if (filter === "All packages") {
      setActiveFilters([]);
    } else {
      setActiveFilters((prev) =>
        prev.includes(filter)
          ? prev.filter((f) => f !== filter)
          : [...prev.filter((f) => f !== "All packages"), filter]
      );
    }
  };

  // Filter the fetched packages
  const filteredPackages =
    activeFilters.length === 0
      ? packages
      : packages.filter((pkg) =>
          activeFilters.every((f) =>
            pkg.idealFor
              .map((tag) => tag.toLowerCase())
              .includes(f.toLowerCase())
          )
        );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Decorative Background */}
      <Decore />

      {/* Hero Section */}
      <div className="relative h-80 flex items-center justify-center">
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl text-blue-900 font-bold mb-12">
            Our packages
          </h1>
          <p className="text-xl text-gray-300 opacity-90">
            Select your package with our options
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                (activeFilters.length === 0 && filter === "All packages") ||
                (activeFilters.includes(filter) && filter !== "All packages")
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16 relative z-10">
          {filteredPackages.map((pkg) => (
            <PackageCard
              id={pkg._id}
              name={pkg.name}
              theme={pkg.theme}
              packageIcon={pkg.packageIcon}
              idealFor={pkg.idealFor}
              startingPrice={pkg.startingPrice}
              dalyPlans={pkg.dailyPlans.length}
              durationUnit="Days"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelPackagesPage;
