import React from 'react';

interface PlanData {
  icon: string;
  planName: string;
  planTheme: string;
  price: number;
  days: number;
  idealFor: string[];
}

const planData: PlanData[] = [
  {
    icon: '🏖️',
    planName: 'Surf & Chill Package',
    planTheme: 'Romance, Relaxation & Luxury',
    price: 39,
    days: 5,
    idealFor: ['anniversary couples', 'Honeymooners', 'special event']
  },
  {
    icon: '🧘‍♀️',
    planName: 'Wellness Retreat',
    planTheme: 'Health, Mindfulness & Spa',
    price: 85,
    days: 7,
    idealFor: ['stress relief', 'self-care', 'meditation enthusiasts']
  },
  {
    icon: '🏔️',
    planName: 'Mountain Adventure',
    planTheme: 'Adventure, Hiking & Nature',
    price: 65,
    days: 6,
    idealFor: ['adventure seekers', 'nature lovers', 'hiking groups']
  },
  {
    icon: '🌴',
    planName: 'Tropical Paradise',
    planTheme: 'Beach, Water Sports & Relaxation',
    price: 120,
    days: 8,
    idealFor: ['beach lovers', 'water sports', 'tropical getaway']
  },
  {
    icon: '🦋',
    planName: 'Wildlife Safari',
    planTheme: 'Wildlife, Photography & Adventure',
    price: 150,
    days: 10,
    idealFor: ['wildlife enthusiasts', 'photographers', 'safari adventure']
  },
  {
    icon: '🏊‍♂️',
    planName: 'Island Hopping',
    planTheme: 'Beaches, Culture & Exploration',
    price: 95,
    days: 9,
    idealFor: ['island explorers', 'cultural experience', 'beach hopping']
  },
  {
    icon: '🏊‍♀️',
    planName: 'Diving Expedition',
    planTheme: 'Underwater, Marine Life & Adventure',
    price: 180,
    days: 12,
    idealFor: ['diving enthusiasts', 'marine biology', 'underwater photography']
  },
  {
    icon: '🏔️',
    planName: 'Alpine Experience',
    planTheme: 'Mountains, Snow Sports & Luxury',
    price: 200,
    days: 14,
    idealFor: ['snow sports', 'mountain climbing', 'alpine adventure']
  },
  {
    icon: '❤️',
    planName: 'Romantic Getaway',
    planTheme: 'Romance, Fine Dining & Luxury',
    price: 75,
    days: 4,
    idealFor: ['couples retreat', 'romantic dinner', 'intimate vacation']
  },
  {
    icon: '🏛️',
    planName: 'Cultural Heritage',
    planTheme: 'History, Architecture & Culture',
    price: 110,
    days: 11,
    idealFor: ['history buffs', 'cultural immersion', 'architecture lovers']
  }
];

const AddedTable: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tl-2xl">
                Icon
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Plan Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Plan Theme
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Days
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Ideal for
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Edit
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tr-2xl">
                View
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {planData.map((plan, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-2xl">
                  {plan.icon}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {plan.planName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {plan.planTheme}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                  ${plan.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 text-center">
                  {plan.days}
                </td>
                <td className="px-6 py-4 text-xs text-gray-600 max-w-xs">
                  <div className="space-y-1">
                    {plan.idealFor.map((item, idx) => (
                      <div key={idx}>{item}</div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:text-blue-700 transition-colors p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:text-blue-700 transition-colors p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-gray-100 text-center">
        <button className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors">
          View all plans
        </button>
      </div>
    </div>
  );
};

export default AddedTable;