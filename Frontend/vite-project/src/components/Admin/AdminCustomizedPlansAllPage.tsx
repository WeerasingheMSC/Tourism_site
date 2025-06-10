import React from 'react';
import CustomizeTable from './CustomizeTable';

const AdminCustomizedPlansAllPage: React.FC = () => {
  return (
    <div className=" min-h-screen flex flex-col relative z-10 pt-20">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8 pt-12 pb-12 flex-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8 mt-2">
          Customised plans all list
        </h1>
        {/* Search and filter row */}
        <div className="flex justify-end items-center mb-4 gap-2">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            <input
              type="text"
              placeholder="Search"
              className="outline-none bg-transparent text-sm text-gray-700 w-32 sm:w-48"
            />
            <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-2-2" />
            </svg>
          </div>
          <button className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:bg-blue-50 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="13" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 17v1a4 4 0 01-8 0v-1" />
            </svg>
          </button>
          <button className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:bg-blue-50 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        {/* Table */}
        <div className="rounded-2xl border border-gray-300 overflow-hidden bg-white">
          <CustomizeTable />
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <nav className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-semibold">1</button>
            <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-blue-50">2</button>
            <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-blue-50">3</button>
            <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-blue-50">4</button>
            <span className="w-8 h-8 flex items-center justify-center text-gray-400">…</span>
            <button className="w-8 h-8 rounded-full text-gray-600 hover:bg-blue-50">9</button>
          </nav>
        </div>
      </main>

      
    </div>
  );
};

export default AdminCustomizedPlansAllPage;