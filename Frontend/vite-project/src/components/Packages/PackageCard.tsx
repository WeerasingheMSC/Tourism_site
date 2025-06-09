import React from 'react';


interface PackageCardProps {
  title?: string;
  subtitle?: string;
  image?: string;
  tags?: string[];
  price?: number;
  duration?: number;
  durationUnit?: string;
}

const PackageCard: React.FC<PackageCardProps> = ({
  title = "Surf & Chill Package",
  subtitle = "Surfing & Beach Lifestyle",
  tags = ["Young travelers", "surfers", "backpackers"],
  image = "/.jpg",
  price = 18,
  duration = 3,
  durationUnit = "Days"
}) => {
  return (
    <div className="bg-white/30 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-100 ">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          {/* Beach umbrella icon */}
          <div className="w-16 h-16 relative">
            <img src={image} alt="Beach umbrella" className="w-full h-full object-contain" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Price and Duration */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-gray-500 text-sm">From</span>
          <span className="text-2xl font-bold text-blue-500">${price}</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{duration}</div>
          <div className="text-sm text-gray-500">{durationUnit}</div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;