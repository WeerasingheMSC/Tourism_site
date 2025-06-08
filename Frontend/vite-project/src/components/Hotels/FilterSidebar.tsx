import React, { useState } from "react";

const hotelTypes = [
  "Resort Hotel",
  "City Hotels",
  "Home Stays",
  "Heritage",
  "Luxury Hotels",
  "Ayurvedic Hotels",
  "Transit Hotels",
  "Family-Friendly Hotels",
];

const commonAreas = [
  "Colombo",
  "Galle",
  "Kandy",
  "Nuwara Eliya",
  "Matara",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Anuradhapura",
  "Polonnaruwa",
  "Matale",
  "Jaffna",
  "Badulla",
];

const popularPlaces = [
  "Sigiriya",
  "Kandy",
  "Mirissa",
  "Pasikudha",
  "Ella",
  "Nuwara Eliya",
  "Yala National Park",
  "Galle Fort",
  "Trincomalee",
];

const FilterSidebar: React.FC = () => {
  const [collapse, setCollapse] = useState({
    hotelType: true,
    price: true,
    commonAreas: true,
    popularPlaces: true,
  });

  const toggle = (section: keyof typeof collapse) => {
    setCollapse((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-full max-w-xs p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filter</h2>

      {/* Hotel Type */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggle("hotelType")}
        >
          <h3 className="font-semibold">Hotel Type</h3>
          <span>{collapse.hotelType ? "−" : "+"}</span>
        </div>
        {collapse.hotelType && (
          <div className="mt-2 space-y-1">
            {hotelTypes.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <input type="checkbox" id={type} />
                <label htmlFor={type} className="text-sm">
                  {type}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggle("price")}
        >
          <h3 className="font-semibold">Price Range</h3>
          <span>{collapse.price ? "−" : "+"}</span>
        </div>
        {collapse.price && (
          <div className="mt-2">
            <input type="range" min={4} max={60} className="w-full" />
            <p className="text-sm mt-1 text-gray-500">$4.99 – $59.99</p>
          </div>
        )}
      </div>

      {/* Commonly Visited Areas */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggle("commonAreas")}
        >
          <h3 className="font-semibold">Commonly Visited Areas</h3>
          <span>{collapse.commonAreas ? "−" : "+"}</span>
        </div>
        {collapse.commonAreas && (
          <div className="mt-2 space-y-1">
            {commonAreas.map((area) => (
              <div key={area} className="flex items-center gap-2">
                <input type="checkbox" id={area} />
                <label htmlFor={area} className="text-sm">
                  {area}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Near Famous Places */}
      <div>
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggle("popularPlaces")}
        >
          <h3 className="font-semibold">Near Famous places</h3>
          <span>{collapse.popularPlaces ? "−" : "+"}</span>
        </div>
        {collapse.popularPlaces && (
          <div className="mt-2 space-y-1">
            {popularPlaces.map((place) => (
              <div key={place} className="flex items-center gap-2">
                <input type="checkbox" id={place} />
                <label htmlFor={place} className="text-sm">
                  {place}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
