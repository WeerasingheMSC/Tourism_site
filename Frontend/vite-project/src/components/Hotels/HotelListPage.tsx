import React from "react";
import FilterSidebar from "./FilterSidebar";
import HotelGrid from "./HotelGrid";
import { hotels } from "../../data/hotels";

const HotelListPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-center text-3xl font-bold mb-6">Our Best Hotels</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <FilterSidebar />

        {/* Hotel Cards */}
        <div className="flex-1">
          <HotelGrid hotels={hotels} />
        </div>
      </div>
    </div>
  );
};

export default HotelListPage;
