import React from "react";
import HotelCard from "./HotelCard";

type Hotel = {
  id: string;
  name: string;
  city: string;
  price: number;
  imageUrl: string;
  rating: number;
  tags: string[];
};

type Props = {
  hotels: Hotel[];
};

const HotelGrid: React.FC<Props> = ({ hotels }) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel.id}
          name={hotel.name}
          city={hotel.city}
          price={hotel.price}
          imageUrl={hotel.imageUrl}
          rating={hotel.rating}
          tags={hotel.tags}
        />
      ))}
    </div>
  );
};

export default HotelGrid;
