import React, { useEffect, useMemo, useState } from "react";
import {
  getAllHotelBookings,
  updateHotelBookingStatus,
  type HotelBookingRow,
  type BookingStatus,
} from "../../api/hotelBooking";

// same badge colors
const getStateColor = (state: string) => {
  switch (state) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "confirmed":
      return "bg-green-100 text-green-700 border-green-200";
    case "cancelled":
    case "rejected":
      return "bg-red-100 text-red-700 border-red-200";
    case "completed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const statusOptions: BookingStatus[] = [
  "pending",
  "confirmed",
  "cancelled",
  "rejected",
  "completed",
];

const AdminHotelBookingsTable: React.FC = () => {
  const [rows, setRows] = useState<HotelBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});

  // filters
  const [statusFilter, setStatusFilter] =
    useState<"all" | BookingStatus>("all");

  // NEW: search term (by hotel name, hotel ID, or booking ID)
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    getAllHotelBookings()
      .then((data) => setRows(data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  // derived, filtered rows (client-side)
  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const statusOk =
        statusFilter === "all" ? true : (r.status || "pending") === statusFilter;

      if (!q) return statusOk;

      const hotelName = (r.hotelName || "").toLowerCase();
      const hotelId = (r.hotelId || "").toString().toLowerCase();
      const bookingId = (r._id || "").toString().toLowerCase();

      // match if any of these contains the query
      const textOk =
        hotelName.includes(q) || hotelId.includes(q) || bookingId.includes(q);

      return statusOk && textOk;
    });
  }, [rows, statusFilter, search]);

  const handleChangeStatus = async (id: string, next: BookingStatus) => {
    // optimistic update
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status: next } : r)));
    setSavingIds((prev) => ({ ...prev, [id]: true }));
    try {
      await updateHotelBookingStatus(id, next);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSavingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) return <div className="my-8 text-center">Loading…</div>;
  if (error) return <div className="my-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="">
      {/* Filter + Search bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        {/* Left spacer or summary (optional) */}
        <div className="text-sm text-gray-600">
          Total: {rows.length} | Showing: {visibleRows.length}
        </div>

        {/* Right controls: search + status filter */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by hotel or ID…"
              className="border border-gray-300 rounded-lg text-sm px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-200 w-64"
            />
            {/* small search icon */}
            <svg
              className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
            </svg>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <select
              className="border border-gray-300 rounded-lg text-sm px-3 py-1.5 focus:outline-none"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | BookingStatus)
              }
            >
              <option value="all">All</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto flex justify-center">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tl-2xl">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tl-2xl">
                  Hotel ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Hotel
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Room Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Dates
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Rooms
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 rounded-tr-2xl">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Contact Client
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {visibleRows.map((b) => {
                const dateStr = `${new Date(b.startDate).toLocaleDateString()} → ${new Date(b.endDate).toLocaleDateString()}`;
                const totalStr = `${b.currency} ${b.totalPrice?.toFixed(2) ?? "0.00"}`;
                const saving = !!savingIds[b._id];

                return (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium break-all">
                      {b._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 break-all">
                      {b.hotelId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{b.hotelName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{b.roomType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{dateStr}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{b.numRooms}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{totalStr}</td>

                    {/* Single dropdown in status cell */}
                    <td className="px-6 py-4 text-sm">
                      <select
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStateColor(
                          b.status || "pending"
                        )}`}
                        value={b.status || "pending"}
                        disabled={saving}
                        onChange={(e) =>
                          handleChangeStatus(b._id, e.target.value as BookingStatus)
                        }
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {saving && (
                        <span className="ml-2 text-xs text-gray-500">Updating…</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{b.contactNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 text-center">
          <span className="text-sm text-gray-500">
            Showing {visibleRows.length} booking{visibleRows.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminHotelBookingsTable;
