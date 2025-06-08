import React from "react";

type HotelProps = {
  name: string;
  city: string;
  price: number;
  imageUrl: string;
  rating: number;
  tags: string[];
};

const HotelCard: React.FC<HotelProps> = ({
  name,
  city,
  price,
  imageUrl,
  rating,
  tags,
}) => {
  return (
    <div
      className="rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl bg-white 
                 animate-fade-slide-up"
    >
      <img src={imageUrl} alt={name} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h2 className="font-semibold text-lg">{name}</h2>
        <p className="text-gray-500 text-sm">{city}</p>
        <div className="flex items-center gap-2 my-2 flex-wrap">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-blue-600 font-bold">${price}</span>
          <span className="text-sm text-yellow-500">⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
