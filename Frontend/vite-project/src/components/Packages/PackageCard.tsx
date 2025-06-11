// src/components/PackageCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface PackageCardProps {
  id: string;                   // ← 1) include the package ID
  name: string;
  theme: string;
  packageIcon: string;
  idealFor: string[];
  startingPrice: string;        // string, e.g. "1200 USD"
  dalyPlans: number;
  durationUnit: string;
}

const PackageCard: React.FC<PackageCardProps> = ({
  id,                            // ← 1) receive id
  name,
  theme,
  idealFor,
  packageIcon,
  startingPrice,
  dalyPlans,
  durationUnit
}) => (
  // 2) Wrap in Link to `/packages/${id}`
  <Link
    to={`/packages/${id}`}
    className="block cursor-pointer"   // 3) cursor change
  >
    <div className="bg-white/30 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 relative">
            <img src={packageIcon} alt={name} className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
          <p className="text-gray-600 text-sm">{theme}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {idealFor.map((tag, i) => (
          <span
            key={i}
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
          <span className="text-2xl font-bold text-blue-500">{startingPrice}$</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{dalyPlans}</div>
          <div className="text-sm text-gray-500">{durationUnit}</div>
        </div>
      </div>
    </div>
  </Link>
);

export default PackageCard;
