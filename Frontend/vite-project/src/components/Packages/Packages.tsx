import React, { useState } from 'react';
import PackageCard from './PackageCard';
import Decore from './Decore';
import beachIcon from '../../assets/beach icon.png';

const TravelPackagesPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filters = [
    'All packages', 'Beach', 'Honeymoon', 'Couple', 'Religious',
    'Pilgrims', 'Wild Life', 'Hills'
  ];

  const packages = [
    {
      title: "Surf & Chill Package",
      subtitle: "Surfing & Beach Lifestyle",
      tags: ["Young travelers", "surfers", "backpackers", "Beach"],
      image: beachIcon,
      price: 18,
      duration: 3,
    },
    {
      title: "Sacred Sri Lanka – Pilgrimage Tour",
      subtitle: "Buddhist Heritage & Spirituality",
      tags: ["Pilgrims", "seniors", "spiritual seekers"],
      image: beachIcon,
      price: 22,
      duration: 3,
    },
    {
      title: "10Day Island Explorer",
      subtitle: "Beaches, Hills, Safaris & Culture",
      tags: ["Firstime visitors", "families", "groups"],
      image: beachIcon,
      price: 32,
      duration: 10,
    },
    {
      title: "Safari + Beach Combo",
      subtitle: "Wildlife & Coastal Relaxation",
      tags: ["Families", "couples", "mixed interest groups"],
      image: beachIcon,
      price: 18,
      duration: 4,
    },
    {
      title: "Wild Wonders of Yala",
      subtitle: "Wildlife & Culture",
      tags: ["couples", "photographers", "Nature lovers"],
      image: beachIcon,
      price: 11,
      duration: 2,
    },
    {
      title: "South Coast Beach Escape",
      subtitle: "Beaches & Heritage",
      tags: ["beach lovers", "families", "solo travelers", "couples"],
      image: beachIcon,
      price: 15,
      duration: 3,
    },
    {
      title: "East Coast Tropical Getaway",
      subtitle: "Beaches, Snorkeling & Culture",
      tags: ["Beach lovers", "couples", "divers", "families"],
      image: beachIcon,
      price: 25,
      duration: 5,
    },
    {
      title: "Highland Adventure & Tea Trails",
      subtitle: "Scenic Mountains, Waterfalls & Tea Culture",
      tags: ["local explorers", "couples", "nature lovers", "Families"],
      image: beachIcon,
      price: 20,
      duration: 4,
    },
    {
      title: "Luxury Honeymoon Retreat",
      subtitle: "Romance, Relaxation & Luxury",
      tags: ["Honeymooners", "special event", "anniversary couples"],
      image: beachIcon,
      price: 39,
      duration: 5,
    },
    {
      title: "Cultural Triangle Trail",
      subtitle: "Ancient Cities & Heritage",
      tags: ["families", "students", "pilgrims", "History lovers", "Religious"],
      image: beachIcon,
      price: 20,
      duration: 4,
    }
  ];

  // Handle filter click
  const handleFilterClick = (filter: string) => {
    if (filter === 'All packages') {
      setActiveFilters([]);
    } else {
      setActiveFilters((prev) =>
        prev.includes(filter)
          ? prev.filter(f => f !== filter)
          : [...prev.filter(f => f !== 'All packages'), filter]
      );
    }
  };

  // Filter packages based on selected filters
  const filteredPackages = activeFilters.length === 0
    ? packages
    : packages.filter(pkg =>
        activeFilters.every(filter =>
          pkg.tags.map(tag => tag.toLowerCase()).includes(filter.toLowerCase())
        )
      );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Decore image */}
      <Decore />

      {/* Hero Section */}
      <div className="relative h-80 flex items-center justify-center">
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl text-blue-900 font-bold mb-12">Our packages</h1>
          <p className="text-xl text-gray-300 opacity-90">Select your package with our options</p>
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
                (activeFilters.length === 0 && filter === 'All packages') ||
                (activeFilters.includes(filter) && filter !== 'All packages')
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16 relative z-10" >
          {filteredPackages.map((pkg, index) => (
            <PackageCard
              key={index}
              title={pkg.title}
              subtitle={pkg.subtitle}
              image={pkg.image}
              tags={pkg.tags}
              price={pkg.price}
              duration={pkg.duration}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelPackagesPage;