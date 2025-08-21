import { useEffect, useState, type JSX } from 'react'
import { ExternalLink } from 'lucide-react'
import { getPendingHotels, approveRejectHotel } from '../../api/hotel'

interface PendingHotel {
  _id: string
  name: string
  contact: { phone?: string; email?: string }
  approvalStatus: { status: 'pending' | 'approved' | 'rejected' }
}

/**
 * A React component to display and manage pending hotels.
 */
export default function PendingHotelsTable(): JSX.Element {
  const [hotels, setHotels] = useState<PendingHotel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPendingHotels()
      .then((data) => setHotels(data))
      .catch((err) => setError(err.message || 'Failed to load pending hotels'))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      await approveRejectHotel(id, newStatus)
      setHotels((prev) =>
        prev.map((h) =>
          h._id === id ? { ...h, approvalStatus: { status: newStatus } } : h
        )
      )
    } catch (err: any) {
      console.error('Failed to update status:', err)
      alert(err.response?.data?.message || 'Status update failed')
    }
  }

  if (loading) return <div className="my-8 text-center">Loading pending hotels…</div>
  if (error) return <div className="my-8 text-center text-red-500">Error: {error}</div>

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Hotel ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hotels.map((hotel) => (
                <tr key={hotel._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 break-all">{hotel._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{hotel.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{hotel.contact.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{hotel.contact.email || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    {hotel.approvalStatus.status === 'pending' ? (
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        defaultValue=""
                        onChange={(e) =>
                          handleStatusChange(
                            hotel._id,
                            e.target.value as 'approved' | 'rejected'
                          )
                        }
                      >
                        <option value="" disabled>Pending</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hotel.approvalStatus.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {hotel.approvalStatus.status.charAt(0).toUpperCase() + hotel.approvalStatus.status.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <a
                      href={`/admin/hotels/view/${hotel._id}`}
                      
                      className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors p-1"
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
      <div className="mt-4 text-center">
        <a href="/admin/hotels/pending" className="text-blue-600 hover:underline">View all</a>
      </div>
    </div>
  )
}
