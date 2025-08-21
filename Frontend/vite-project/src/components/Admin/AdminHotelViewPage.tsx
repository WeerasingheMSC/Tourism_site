// src/pages/AdminHotelViewPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getHotelByIdAdmin } from "../../api/hotel";

type GeoPoint = { type: "Point"; coordinates: [number, number] };
type RoomType = {
  name: string;
  description?: string;
  pricePerNight?: number;
  totalRooms?: number;
  amenities?: string[];
  maxOccupancy?: number;
};
type Review = {
  _id: string;
  user?: { name?: string };
  rating: number;
  comment?: string;
  createdAt?: string;
};

interface AdminHotel {
  _id: string;
  name: string;
  description?: string;
  fullDescription?: string;
  images?: string[];
  amenities?: string[];
  roomTypes?: RoomType[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    geoLocation?: GeoPoint;
    postalCode?: string;
  };
  contact?: { phone?: string; email?: string; website?: string };
  policies?: {
    checkInTime?: string;
    checkOutTime?: string;
    cancellationPolicy?: string;
    childrenAndBeds?: string;
    ageRestriction?: string;
    petsAllowed?: boolean;
  };
  starRating?: number;
  reviews?: Review[];
  approvalStatus?: { status?: "pending" | "approved" | "rejected"; adminNotes?: string };
  hotelType?: string;
  createdAt?: string;
  updatedAt?: string;
}

const badgeClass = (status?: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const AdminHotelViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<AdminHotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getHotelByIdAdmin(id)
      .then(setHotel)
      .catch((err: { response: { data: { message: any; }; }; message: any; }) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const avgRating = useMemo(() => {
    const r = hotel?.reviews ?? [];
    if (!r.length) return 0;
    const sum = r.reduce((s, x) => s + (Number(x.rating) || 0), 0);
    return +(sum / r.length).toFixed(1);
  }, [hotel]);

  if (loading) return <div className="pt-28 text-center">Loading hotel…</div>;
  if (error || !hotel)
    return <div className="pt-28 text-center text-red-600">Error: {error || "Not found"}</div>;

  const {
    name,
    approvalStatus,
    description,
    fullDescription,
    images = [],
    amenities = [],
    roomTypes = [],
    address,
    contact,
    policies,
    starRating,
    reviews = [],
    hotelType,
    createdAt,
    updatedAt,
  } = hotel;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500">
        <Link to="/admin/hotels" className="hover:text-blue-600">Hotels</Link>
        <span className="mx-2">{">"}</span>
        <span className="text-gray-700">{name}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              {hotelType && <span>{hotelType}</span>}
              {starRating != null && (
                <span className="inline-flex items-center gap-1">
                  <span className="font-medium">{starRating}</span>
                  <span>★</span>
                </span>
              )}
              <span>•</span>
              <span>{reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
              {avgRating > 0 && <span className="ml-2 text-blue-600 font-semibold">Avg {avgRating}</span>}
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass(approvalStatus?.status)}`}>
            {approvalStatus?.status?.[0]?.toUpperCase()}{approvalStatus?.status?.slice(1) || "Pending"}
          </div>
        </div>

        {description && (
          <p className="mt-3 text-gray-700">{description}</p>
        )}

        {/* Meta */}
        <div className="mt-4 text-xs text-gray-500 flex gap-4 flex-wrap">
          {createdAt && <span>Created: {new Date(createdAt).toLocaleString()}</span>}
          {updatedAt && <span>Updated: {new Date(updatedAt).toLocaleString()}</span>}
          {approvalStatus?.adminNotes && (
            <span className="text-gray-600">Admin Notes: “{approvalStatus.adminNotes}”</span>
          )}
        </div>
      </div>

      {/* Gallery */}
      {!!images.length && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Hotel ${i}`}
              className="w-full h-56 object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
      )}

      {/* Info grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left: About & Policies */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {(fullDescription || description) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              <div className="text-gray-700 whitespace-pre-line">
                {(fullDescription || description) as string}
              </div>
            </div>
          )}

          {/* Room Types */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Room Types</h2>
            {roomTypes.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-blue-50 border-b border-gray-200">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price / night</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total rooms</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Max occupancy</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amenities</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {roomTypes.map((rt, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{rt.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {rt.pricePerNight != null ? `$${rt.pricePerNight.toFixed(2)}` : "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{rt.totalRooms ?? "-"}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{rt.maxOccupancy ?? "-"}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <div className="flex flex-wrap gap-1">
                            {(rt.amenities || []).map((a, i) => (
                              <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{a}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No room types defined.</p>
            )}
          </div>

          {/* Policies */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Policies</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
              {policies?.checkInTime && <div><span className="font-medium">Check-in:</span> {policies.checkInTime}</div>}
              {policies?.checkOutTime && <div><span className="font-medium">Check-out:</span> {policies.checkOutTime}</div>}
              {policies?.cancellationPolicy && <div><span className="font-medium">Cancellation:</span> {policies.cancellationPolicy}</div>}
              {policies?.childrenAndBeds && <div><span className="font-medium">Children & beds:</span> {policies.childrenAndBeds}</div>}
              {policies?.ageRestriction && <div><span className="font-medium">Age restriction:</span> {policies.ageRestriction}</div>}
              <div><span className="font-medium">Pets:</span> {policies?.petsAllowed ? "Allowed" : "Not allowed"}</div>
            </div>
          </div>
        </div>

        {/* Right: Address, Contact, Amenities, Reviews summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Address</h2>
            <div className="text-gray-700 text-sm">
              <div>{[address?.street, address?.city, address?.state, address?.country].filter(Boolean).join(", ") || "-"}</div>
              {address?.postalCode && <div>Postal code: {address.postalCode}</div>}
              {address?.geoLocation?.coordinates && (
                <div className="text-xs text-gray-500 mt-1">
                  Coord: {address.geoLocation.coordinates[1]}, {address.geoLocation.coordinates[0]}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
            <div className="text-gray-700 text-sm space-y-1">
              <div>Phone: {contact?.phone || "-"}</div>
              <div>Email: {contact?.email || "-"}</div>
              <div>Website: {contact?.website || "-"}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h2>
            {amenities.length ? (
              <div className="flex flex-wrap gap-2">
                {amenities.map((a, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">{a}</span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No amenities listed.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Reviews</h2>
            <div className="text-sm text-gray-700 mb-3">
              <span className="font-semibold">{reviews.length}</span> total • Avg {avgRating}
            </div>
            <div className="space-y-3 max-h-72 overflow-auto pr-1">
              {reviews.slice(0, 6).map((r) => (
                <div key={r._id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{r.user?.name || "Anonymous"}</span>
                    <span className="text-blue-600 font-semibold">{r.rating}★</span>
                  </div>
                  {r.comment && <p className="text-gray-700 text-sm mt-1">{r.comment}</p>}
                  {r.createdAt && (
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
              {!reviews.length && <p className="text-gray-500 text-sm">No reviews yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHotelViewPage;
