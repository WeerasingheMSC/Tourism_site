// src/pages/CustomizeTable.tsx
import React, { useState, useEffect } from "react";
// 🔄 1) Fetch & update helpers
import {
  getCustomTourRequestsAll,
  updateCustomTourRequestStatus,
} from "../../api/customTourRequest";
import { useNavigate } from "react-router-dom";

interface RequestData {
  _id: string; // 🔄 DB ID
  fullName: string; // 🔄 tourist’s name
  country: string; // 🔄 country
  approvalStatus: { status: string }; // 🔄 nested status
  daysToTravel: number; // 🔄 total days
  budget: string; // 🔄 budget string
}

// Reuse color helper (extended to include approved/rejected)
const getStateColor = (state: string) => {
  switch (state) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "approved": // 🔄 new
      return "bg-green-100 text-green-700 border-green-200";
    case "rejected": // 🔄 new
      return "bg-red-100 text-red-700 border-red-200";
    case "inprogress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    case "finished":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const CustomizeTableAll: React.FC = () => {
  // 🔄 2) Local state
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 🔄 3) Fetch data once on mount
  useEffect(() => {
    getCustomTourRequestsAll()
      .then((res) => {
        setRequests(res.data); // assume res.data: RequestData[]
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔄 4) Handler to update status live
  const handleStatusChange = (id: string, newStatus: string) => {
    updateCustomTourRequestStatus(id, newStatus)
      .then((res) => {
        // API returns { message, request }
        const updated: RequestData = res.data.request;
        setRequests((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, approvalStatus: updated.approvalStatus } : r
          )
        );
      })
      .catch((err) => {
        console.error("Status update failed:", err);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>Loading requests…</p>
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
                Proposal Number
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Country
              </th>
              {/* 🔄 State column stays */}
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                State
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Day
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              {/* 🔄 View column unchanged */}
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tr-2xl">
                View
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((row) => (
              <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                {/* Proposal Number */}
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {row._id}
                </td>
                {/* Name */}
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.fullName}
                </td>
                {/* Country */}
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.country}
                </td>
                {/* 🔄 Replace badge with dropdown */}
                <td className="px-6 py-4">
                  <select
                    value={row.approvalStatus.status}
                    onChange={(e) =>
                      handleStatusChange(row._id, e.target.value)
                    }
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStateColor(
                      row.approvalStatus.status
                    )}`}
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </td>
                {/* Day */}
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.daysToTravel}
                </td>
                {/* Price */}
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {row.budget}
                </td>
                {/* 🔄 View button navigates to detail */}
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      navigate(`/admin/customized-plans-details/${row._id}`)
                    }
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 
                           0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* footer unchanged */}
      <div className="px-6 py-4 border-t border-gray-100 text-center">
        <button
          onClick={() => navigate(`/admin/customized-plans`)}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          View all
        </button>
      </div>
    </div>
  );
};

export default CustomizeTableAll;
