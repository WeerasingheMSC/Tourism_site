import React, { useEffect, useState } from "react";
import PendingHotelsTable from "../Admin/PendingHotelsTable";
import AllHotelsTable from "../Admin/AllHotelsTable";
import AdminHotelBookingsTable from "../Admin/AdminHotelBookingsTable";

import { getAllHotels, getPendingHotels } from "../../api/hotel";
import { getAllHotelBookings } from "../../api/hotelBooking";

const AdminHotelTab: React.FC = () => {
  // card metrics
  const [totalHotels, setTotalHotels] = useState(0);
  const [pendingHotels, setPendingHotelsCount] = useState(0);
  const [allReservations, setAllReservations] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // ---- HOTELS ----
      try {
        const allHotels = await getAllHotels(); // <-- returns array
        if (!mounted) return;

        setTotalHotels(Array.isArray(allHotels) ? allHotels.length : 0);

        try {
          const pending = await getPendingHotels(); // <-- returns array (if you implemented)
          if (!mounted) return;
          setPendingHotelsCount(Array.isArray(pending) ? pending.length : 0);
        } catch {
          // fallback: compute pending from allHotels
          const pendCount = (Array.isArray(allHotels) ? allHotels : []).filter(
            (h: any) => h?.approvalStatus?.status?.toLowerCase?.() === "pending"
          ).length;
          setPendingHotelsCount(pendCount);
        }
      } catch (e) {
        // optional: console.error(e);
      }

      // ---- BOOKINGS ----
      try {
        const bookings = await getAllHotelBookings(); // <-- returns array
        if (!mounted) return;

        const rows = Array.isArray(bookings) ? bookings : [];
        setAllReservations(rows.length);

        setPendingReservations(
          rows.filter((b: any) => (b?.status || "").toLowerCase() === "pending")
            .length
        );

        // revenue: sum ONLY completed bookings.
        // prefer totalPrice; fallback to unitPrice * nights * numRooms
        const completedTotal = rows
          .filter((b: any) => (b?.status || "").toLowerCase() === "completed")
          .reduce((sum: number, b: any) => {
            const fromTotal = Number(b?.totalPrice);
            

            const val = Number.isFinite(fromTotal) ? fromTotal : fallbackToUnitPrice(b);
            return sum + (Number.isFinite(val) ? val : 0);
          }, 0);

        setRevenue(completedTotal);
      } catch (e) {
        // optional: console.error(e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <main className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 pt-24 pb-12 flex-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 mt-2">
          Admin Hotel Dashboard
        </h1>

        {/* Cards now show real values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-white/30 backdrop-blur border-2 border-blue-400 rounded-2xl p-6 flex flex-col items-center shadow-md">
            <span className="text-blue-500 font-semibold text-sm mb-2">
              All Hotels
            </span>
            <span className="text-3xl font-bold text-blue-500 mb-1">
              {totalHotels}
            </span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              Pending Hotels
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1">
              {pendingHotels}
            </span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              All Reservations
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1">
              {allReservations}
            </span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              Pending Reservations
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1">
              {pendingReservations}
            </span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">
              Revenue
            </span>
            <span className="text-3xl font-bold text-gray-900 mb-1">
              {revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1 mt-8">
          Pending Hotels
        </h2>
        <p className="text-gray-500 mb-4">Hotels awaiting admin approval</p>
        <div className="">
          <PendingHotelsTable />
        </div>

        <h2 className="text-2xl font-bold mt-8">All Hotels</h2>
        <div className="mt-4 mb-12">
          <AllHotelsTable />
        </div>

        <h2 className="text-2xl font-bold mt-8">Hotel Bookings</h2>
        <div className="mt-4 mb-12">
          <AdminHotelBookingsTable />
        </div>
      </main>
    </div>
  );
};

export default AdminHotelTab;
function fallbackToUnitPrice(b: any): number {
  // fallback calculation: unitPrice * nights * numRooms
  const unitPrice = Number(b?.unitPrice);
  const nights = Number(b?.nights ?? 1);
  const numRooms = Number(b?.numRooms ?? 1);
  const val = unitPrice * nights * numRooms;
  return Number.isFinite(val) ? val : 0;
}

