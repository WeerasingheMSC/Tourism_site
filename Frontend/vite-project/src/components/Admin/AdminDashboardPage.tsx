import React from 'react';
import AddedTable from './AddedTable';
import CustomizeTable from '../Admin/CustomizeTable';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className=" min-h-screen flex flex-col relative z-10">


      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 pt-24 pb-12 flex-1">
        {/* Dashboard Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 mt-2">Admin Dashboard</h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <div className="bg-white/30 backdrop-blur border-2 border-blue-400 rounded-2xl p-6 flex flex-col items-center shadow-md ">
            <span className="text-blue-500 font-semibold text-sm mb-2">Active Reservation</span>
            <span className="text-3xl font-bold text-blue-500 mb-1">34</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">Total Packages</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">10</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">cancel reservation</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">6</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">Plan proposals</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">12</span>
          </div>
          <div className="bg-white/30 backdrop-blur border border-gray-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
            <span className="text-gray-500 font-semibold text-sm mb-2">Revenue</span>
            <span className="text-3xl font-bold text-gray-900 mb-1">13450</span>
          </div>
        </div>

        {/* All Packages Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1 mt-8">All packages</h2>
        <p className="text-gray-500 mb-4">view and edit all packages here</p>
        <div className="rounded-2xl border border-gray-300 overflow-hidden mb-12 bg-white">
          <AddedTable />
        </div>

        {/* Customized Plans Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1 mt-8">Customised plans</h2>
        <p className="text-gray-500 mb-4">tourist customised plan proposals</p>
        <div className="rounded-2xl border border-gray-300 overflow-hidden bg-white">
          <CustomizeTable />
        </div>
      </main>

    </div>
  );
};

export default AdminDashboardPage;