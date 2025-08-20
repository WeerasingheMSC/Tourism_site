// src/components/AdminDashboardPage.tsx
import React, { useEffect, useState } from "react";
import AddedTable from "./AddedTable";
import CustomizeTable from "../Admin/CustomizeTable";
import AdminBookingTable from "../Admin/AdminBookingTable";
import { getPackages } from "../../api/packages";
import { getAllBookings } from "../../api/bookings";
import { getCustomTourRequests } from "../../api/customTourRequest"; // <— use your helper file's path

type BookingRow = {
  _id: string;
  status?: string;
  totalAmount?: number;
  amount?: number;
  totalPrice?: number;
};




const AdminDashboardPage: React.FC = () => {
  const [totalPackages, setTotalPackages] = useState(0);
  const [allBookings, setAllBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [pendingCustomPlans, setPendingCustomPlans] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // 1) packages
      try {
        const pkgRes = await getPackages();
        if (!mounted) return;
        setTotalPackages(Array.isArray(pkgRes.data) ? pkgRes.data.length : 0);
      } catch {}

      // 2) bookings
      try {
        const bookRes = await getAllBookings();
        const rows: BookingRow[] = Array.isArray(bookRes.data) ? bookRes.data : [];
        if (!mounted) return;

        setAllBookings(rows.length);
        setPendingBookings(
          rows.filter(b => (b.status || "").toLowerCase() === "pending").length
        );
        setRevenue(
          rows.reduce((sum, b) => {
            const val = Number(b.totalAmount ?? b.amount ?? b.totalPrice ?? 0);
            return sum + (isNaN(val) ? 0 : val);
          }, 0)
        );
      } catch {}

      // 3) pending custom tour requests (your helper returns only pendings)
      try {
        const reqRes = await getCustomTourRequests();
        if (!mounted) return;
        const list = Array.isArray(reqRes.data) ? reqRes.data : [];
        setPendingCustomPlans(list.length);
      } catch {}
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <main className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 pt-24 pb-12 flex-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 mt-2">
          Admin Dashboard
        </h1>

        {/* Dashboard Cards (real values) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-white/30 backdrop-blur border-2 border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-md ">
            <span className="text-gray-500 font-semibold text-sm mb-2">Total Packages</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">{totalPackages}</span>
          </div>

          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">All Package Bookings</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">{allBookings}</span>
          </div>

          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">Pending Package Bookings</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">{pendingBookings}</span>
          </div>

          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">Pending Custom Plans</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">{pendingCustomPlans}</span>
          </div>

          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">Revenue</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">
              {revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* All Packages */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1 mt-8">All packages</h2>
        <p className="text-gray-500 mb-4">View and edit all packages here</p>
        <div className="rounded-2xl border border-gray-300 overflow-hidden mb-12 bg-white">
          <AddedTable />
        </div>

        {/* All Bookings */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1 mt-8">All Bookings</h2>
        <p className="text-gray-500 mb-4">View and edit all Booking here</p>
        <div className="rounded-2xl border border-gray-300 overflow-hidden mb-12 bg-white">
          <AdminBookingTable />
        </div>

        {/* Customized Plans Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1 mt-8">Pending Customised Plans</h2>
        <p className="text-gray-500 mb-4">Tourist customised plan proposals</p>
        <div className="rounded-2xl border border-gray-300 overflow-hidden bg-white">
          <CustomizeTable />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
