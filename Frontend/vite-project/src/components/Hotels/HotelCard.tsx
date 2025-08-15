import React from 'react';
import { Link } from 'react-router-dom';

interface HotelCardProps {
  id: string;
  image: string;
  name: string;
  location: string;
  price: string;
  rating: number;
  reviewCount: number;
  tags: string[];
}

const HotelCard: React.FC<HotelCardProps> = ({
  id,
  image,
  name,
  location,
  price,
  rating,
  reviewCount,
  tags
}) => (
  <Link to={`/hotels/${id}`} className="block">
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Hotel Name and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <span className="text-xl font-bold text-blue-500">{price}</span>
        </div>
        
        {/* Location */}
        <p className="text-gray-600 text-sm mb-3">{location}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">{rating.toFixed(2) }</span>
          <span className="text-gray-500 text-sm">({reviewCount})</span>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default HotelCard;