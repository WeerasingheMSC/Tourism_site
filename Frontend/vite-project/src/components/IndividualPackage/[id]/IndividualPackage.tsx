import React, { useState } from 'react';
import beach1 from '../../../assets/beach2.jpg';
import beach2 from '../../../assets/beach3.jpg';
import beach3 from '../../../assets/beach4.jpg';
import beach4 from '../../../assets/beach5.jpg';
import beachIcon from '../../../assets/beach icon.png'; // For the right column icon
import Decore from '../../Packages/Decore';
import { useParams } from 'react-router-dom';

// Dummy data object
const dummyPackage = {
  id: 'surf-chill',
  title: 'Surf & Chill Package',
  subtitle: 'Surfing & Beach Lifestyle',
  icon: beachIcon,
  duration: '3 Days / 2 Nights',
  theme: 'Surfing & Beach Lifestyle',
  idealFor: 'Young travelers, surfers, backpackers',
  price: 19,
  description:
    'Surf, chill, and explore Arugam Bay in 3 unforgettable days—scenic drives, local vibes, lagoon trips, and waves made for you!',
  images: [beach1, beach2, beach3, beach4],
  agenda: [
    {
      day: 1,
      title: 'Drive to Arugam Bay',
      items: [
        'Pickup from Colombo or Ella',
        'Scenic drive to Arugam Bay (approx. 7-8 hrs)',
        'Check-in at surf lodge or budget hotel',
        'Sunset surf session or beach chill',
        'Dinner & overnight stay',
      ],
    },
    {
      day: 2,
      title: 'Surf Lessons & Lagoon Trip',
      items: [
        'Breakfast at lodge',
        'Morning surf lesson with local instructor (board rental included)',
        'Lunch at a beach café',
        'Afternoon boat trip to Elephant Rock & lagoon (nature watching)',
        'Dinner by the bay & overnight stay',
      ],
    },
    {
      day: 3,
      title: 'Relax & Departure',
      items: [
        'Breakfast & optional surf/practice session',
        'Checkout & drive back to Colombo/airport',
        'Tour ends by late afternoon',
      ],
    },
  ],
  included: [
    { label: 'Private driver', detail: '+ vehicle' },
    { label: 'Standard stays', detail: '(2 nights in Arugam Bay)' },
    { label: 'Surf lesson', detail: '& board rental (1 half-day)' },
    { label: 'All 3 meals', detail: 'daily' },
    { label: 'Bottled water' },
    { label: 'Lagoon boat trip' },
  ],
  notIncluded: [
    { label: 'Travel insurance' },
    { label: 'Personal expenses', detail: '(souvenirs, tips)' },
    { label: 'Additional surf lessons or gear rentals' },
  ],
};

const IndividualPackage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pkg = dummyPackage; // In real use, find by id
  const [mainImage, setMainImage] = useState(pkg.images[0]);

  return (
    <div className="min-h-screen relative">
      <Decore />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-25">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <img
                src={mainImage}
                alt="Main"
                className="w-full h-96 object-cover rounded-xl transition-all duration-300"
              />
            </div>
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {pkg.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`focus:outline-none border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                    mainImage === img
                      ? 'border-blue-600'
                      : 'border-transparent hover:border-blue-300'
                  }`}
                  type="button"
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Package Info */}
          <div className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16">
                <img src={pkg.icon} alt="Surfing Icon" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{pkg.title}</h1>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-gray-600 font-medium">Duration:</span>
                <span className="ml-2 text-gray-900">{pkg.duration}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Theme:</span>
                <span className="ml-2 text-gray-900">{pkg.theme}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Ideal For:</span>
                <span className="ml-2 text-gray-900">{pkg.idealFor}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Starting Price:</span>
                <span className="ml-2 text-blue-600 font-bold text-xl">${pkg.price}.00 per person</span>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              {pkg.description}
            </p>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Reserve Now
            </button>
          </div>
        </div>

        {/* Agenda Section */}
        <div className="mt-12 rounded-2xl ">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">our agenda for the plan</h2>
          <div className="space-y-8 border-3 border-gray-100 rounded-lg p-6">
            {pkg.agenda.map((day, idx) => (
              <div
                key={idx}
                className={`flex ${idx < pkg.agenda.length - 1 ? 'border-b-3 border-gray-100 pb-5' : 'pb-5'}`}
              >
                {/* Left: Title and Day */}
                <div className="w-1/2 pl-6 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{day.title}</h3>
                  <p className="text-gray-600 mb-0">( Day {day.day} )</p>
                </div>
                {/* Right: Agenda Items */}
                <div className="w-1/2 pl-6">
                  <ul className="space-y-2 text-gray-700">
                    {day.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-white/95 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            For your further information that what we provide and not provide
          </h3>
        </div>

        {/* What's Included/Not Included Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {/* What's Included */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-3 border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">What's Included</h3>
            <ul className="space-y-3">
              {pkg.included.map((inc, idx) => (
                <li className="flex items-start gap-3" key={idx}>
                  <div>
                    <span className="font-medium text-gray-900">{inc.label}</span>
                    {inc.detail && <span className="text-gray-600"> {inc.detail}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* What's Not Included */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-3 border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">What's Not Included</h3>
            <ul className="space-y-3">
              {pkg.notIncluded.map((inc, idx) => (
                <li className="flex items-start gap-3" key={idx}>
                  <div>
                    <span className="text-gray-900">{inc.label}</span>
                    {inc.detail && <span className="text-gray-600"> {inc.detail}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualPackage;