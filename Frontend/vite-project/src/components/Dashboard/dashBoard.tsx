// src/pages/TouristDashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Request {
  _id: string;
  fullName: string;
  email: string;
  arrivalDate: string;
  departureDate: string;
  approvalStatus: { status: string; adminNotes?: string };
}

const TouristDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [selected, setSelected] = useState<Request | null>(null);

  // 1) Load & guard user
  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) {
      navigate('/login');
      return;
    }
    try {
      const u: User = JSON.parse(raw);
      if (u.role !== 'tourist') {
        navigate('/register');
        return;
      }
      setUser(u);
    } catch {
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  // 2) Fetch requests with auth header
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchRequests = async () => {
      try {
        const res = await axios.get<Request[]>(
          `http://localhost:5000/api/tours/requests?email=${encodeURIComponent(user.email)}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setRequests(res.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('Failed to fetch requests:', err.response || err);
          if (err.response?.status === 401) {
            // token invalid or expired
            localStorage.clear();
            navigate('/login');
          }
        } else {
          console.error('Failed to fetch requests:', err);
        }
      }
    };

    fetchRequests();
  }, [user, navigate]);

  // 3) Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return null;

  const pending = requests.filter(r => r.approvalStatus.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hello, {user.name}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Pending Package Requests</h2>
        {pending.length === 0 ? (
          <p className="text-gray-600">You have no pending requests.</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Request ID</th>
                <th className="px-4 py-2 text-left">Arrival</th>
                <th className="px-4 py-2 text-left">Departure</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(r => (
                <tr key={r._id} className="border-t">
                  <td className="px-4 py-2">{r._id.slice(-6)}</td>
                  <td className="px-4 py-2">{new Date(r.arrivalDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(r.departureDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 capitalize">{r.approvalStatus.status}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelected(r)}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Request Details</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Full Name:</strong> {selected.fullName}</p>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Arrival:</strong> {new Date(selected.arrivalDate).toLocaleDateString()}</p>
              <p><strong>Departure:</strong> {new Date(selected.departureDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {selected.approvalStatus.status}</p>
              {selected.approvalStatus.adminNotes && (
                <p><strong>Admin Notes:</strong> {selected.approvalStatus.adminNotes}</p>
              )}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TouristDashboard;
