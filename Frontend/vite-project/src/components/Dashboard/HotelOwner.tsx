import React, { useEffect, useState } from "react";
import { getOwnerHotels } from "../../api/hotel";
import HotelOwnerBookingTable from "../../components/HotelDashboard/HotelOwnerBookingTable";

const AdminDashboardPage: React.FC = () => {
  // ─── owner’s hotels ──────────────────────────────────────
  const [hotels, setHotels] = useState<any[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [errorHotels, setErrorHotels] = useState<string | null>(null);

  useEffect(() => {
    getOwnerHotels()
      .then((data) => setHotels(data))
      .catch((err) =>
        setErrorHotels(err.response?.data?.message || err.message)
      )
      .finally(() => setLoadingHotels(false));
  }, []);

  const handleDashboardNavigation = () => {
    navigate("/hotel-partner-dashboard");
  };

  return (
    <div className=" min-h-screen flex flex-col relative z-10">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 pt-24 pb-12 flex-1">
        {/* Dashboard Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 mt-2">
          Hotel Owner Dashboard
        </h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-white/30 backdrop-blur border-2 border-blue-400 rounded-2xl p-6 flex flex-col items-center shadow-md ">
            <span className="text-blue-500 font-semibold text-sm mb-2">
              Active Reservation
            </span>
            <span className="text-3xl font-bold text-blue-500 mb-1">34</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              Total Packages
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1">10</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              cancel reservation
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1">6</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              Plan proposals
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1">12</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              Revenue
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1">13450</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Hotels</h2>

        {loadingHotels ? (
          <div className="my-8 text-center">Loading your hotels…</div>
        ) : errorHotels ? (
          <div className="my-8 text-center text-red-500">
            Error: {errorHotels}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Hotel ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hotels.map((hotel) => (
                    <tr key={hotel._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 break-all">
                        {hotel._id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {hotel.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {hotel.address?.city || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {hotel.address?.state || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            hotel.approvalStatus.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : hotel.approvalStatus.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {hotel.approvalStatus.status.charAt(0).toUpperCase() +
                            hotel.approvalStatus.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={`/hotels`}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* ─── My Bookings Table ──────────────────────────────── */}
        {hotels.map((hotel) => (
          <div
            className="mt-10 bg-white rounded-2xl shadow-sm "
            key={hotel._id}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Bookings for {hotel.name}
            </h2>
            <HotelOwnerBookingTable hotelId={hotel._id} />
          </div>
        ))}
      </main>
    </div>
  );
};

export default AdminDashboardPage;

{
  /* ─── My Bookings For Each Hotel ──────────────────────── */
}
