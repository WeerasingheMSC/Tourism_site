// src/components/Admin/AllHotelsTable.tsx
import { useEffect, useState, type JSX } from "react";
import { ExternalLink } from "lucide-react";
import { getAllHotels } from "../../api/hotel";

interface Hotel {
  _id: string;
  name: string;
  address: { country?: string; state?: string };
  contact: { phone?: string; email?: string };
  approvalStatus: { status: "pending" | "approved" | "rejected" };
}

export default function AllHotelsTable(): JSX.Element {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllHotels()
      .then((data) => setHotels(data))
      .catch((err) => {
        console.error("getAllHotels error:", err.response?.data);
        setError(
          err.response?.data?.message || JSON.stringify(err.response?.data)
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="my-8 text-center">Loading hotels…</div>;
  if (error)
    return <div className="my-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Hotel ID
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
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                View
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {hotels.map((hotel) => (
              <tr
                key={hotel._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 break-all">
                  {hotel._id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {hotel.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {hotel.address.country || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {hotel.address.state || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {hotel.contact.phone || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {hotel.contact.email || "-"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      hotel.approvalStatus.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : hotel.approvalStatus.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {hotel.approvalStatus.status.charAt(0).toUpperCase() +
                      hotel.approvalStatus.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <a
                    href={`/admin/hotels/${hotel._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-500 hover:text-blue-700 p-1"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
