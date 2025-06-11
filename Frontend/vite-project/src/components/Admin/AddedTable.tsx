// src/pages/AddedTable.tsx
import React, { useState, useEffect } from "react";
// 🔄 1) Import your real API helper
import { getPackages, deletePackage } from "../../api/packages"; // adjust path if needed :contentReference[oaicite:0]{index=0}
import { useNavigate } from "react-router-dom";

interface PackageRow {
  _id: string;
  name: string;
  theme: string;
  startingPrice: string;
  packageIcon: string;
  idealFor: string[];
  dailyPlans: any[]; // we'll use .length for days
}



  

const AddedTable: React.FC = () => {
  // 🔄 2) Local state for fetched packages, loading & error
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleClick = () => {
    // e.g. run some logic here...
    // saveDraft();
    // then navigate:
    navigate("/addPackage");
  };

  // 🔄 3) Fetch data once on mount
  useEffect(() => {
    getPackages()
      .then((res) => {
        setPackages(res.data); // assume res.data is an array of PackageRow
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔄 2) DELETE handler: call API then filter out from state
  const handleDelete = (id: string) => {
    deletePackage(id)
      .then(() => {
        setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        // optionally show UI feedback
      });
  };

  // 🔄 4) Handle loading / error states
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>Loading packages…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

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
              {/* 🔄 Added Delete column header */}
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Delete
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tr-2xl">
                View
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* 🔄 5) Map over real data */}
            {packages.map((pkg, index) => (
              <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                {/* Icon */}
                <td className="px-6 py-4 text-2xl">
                  <img
                    src={pkg.packageIcon}
                    alt={pkg.name}
                    className="w-8 h-8 object-contain"
                  />
                </td>
                {/* Name */}
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {pkg.name}
                </td>
                {/* Theme */}
                <td className="px-6 py-4 text-sm text-gray-600">{pkg.theme}</td>
                {/* Price */}
                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                  {pkg.startingPrice}
                </td>
                {/* Days = number of entries in dailyPlans */}
                <td className="px-6 py-4 text-sm text-gray-900 text-center">
                  {pkg.dailyPlans.length}
                </td>
                {/* Ideal For */}
                <td className="px-6 py-4 text-xs text-gray-600 max-w-xs">
                  <div className="space-y-1">
                    {pkg.idealFor.map((item, idx) => (
                      <div key={idx}>{item}</div>
                    ))}
                  </div>
                </td>
                {/* Edit button (unchanged) */}
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:text-blue-700 transition-colors p-1">
                    {/* icon SVG */}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 
                           0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                </td>
                {/* 🔄 Delete button cell */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                  >
                    {/* trash/bin icon SVG */}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 
                           0 01-1.995-1.858L5 7m5 0V4a2 2 0 00-2-2h2a2 2 
                           0 00-2 2v3m6-3v3m-6 0h6"
                      />
                    </svg>
                  </button>
                </td>
                {/* View button (you can hook this up with navigate or Link) */}
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:text-blue-700 transition-colors p-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 
                           0 002 2h10a2 2 0 002-2v-4M14 
                           4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-gray-100 text-center">
        <button
          onClick={handleClick}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          Add New Package
        </button>
      </div>
    </div>
  );
};

export default AddedTable;
