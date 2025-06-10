import React from 'react';

// ...icon imports if needed...

interface ProposalData {
  proposalNumber: string;
  name: string;
  country: string;
  state: 'inprogress' | 'cancelled' | 'finished' | 'pending';
  day: number;
  price: string;
}

const proposalData: ProposalData[] = [
  {
    proposalNumber: 'P-001',
    name: 'John Doe',
    country: 'USA',
    state: 'inprogress',
    day: 5,
    price: '$1200',
  },
  {
    proposalNumber: 'P-002',
    name: 'Jane Smith',
    country: 'UK',
    state: 'pending',
    day: 7,
    price: '$1500',
  },
  {
    proposalNumber: 'P-003',
    name: 'Akira Tanaka',
    country: 'Japan',
    state: 'finished',
    day: 4,
    price: '$900',
  },
  {
    proposalNumber: 'P-004',
    name: 'Maria Garcia',
    country: 'Spain',
    state: 'cancelled',
    day: 6,
    price: '$1100',
  },
];

const CustomizeTable: React.FC = () => {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'inprogress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'finished':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tl-2xl">
                Proposal Number
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Country
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                State
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Day
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tr-2xl">
                View
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {proposalData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {row.proposalNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.country}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStateColor(row.state)}`}>
                    {row.state}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.day}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {row.price}
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:text-blue-700 transition-colors">
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
          View all
        </button>
      </div>
    </div>
  );
};

export default CustomizeTable;