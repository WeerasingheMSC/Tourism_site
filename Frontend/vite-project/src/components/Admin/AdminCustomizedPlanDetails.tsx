// src/pages/AdminCustomizedPlanDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 🔄 Import your API helper to fetch one request by ID
import { getCustomTourRequestById } from "../../api/customTourRequest";
import userImg from "../../assets/user.png";
import logo from "../../assets/logo.jpeg";

// 🔄 Define the shape of a custom tour request from the API
interface RequestType {
  _id: string;
  fullName: string;
  country: string;
  email: string;
  whatsappNumber: string;
  numberOfAdults: number;
  numberOfChildren: number;
  arrivalDate: string;
  departureDate: string;
  daysToTravel: number;
  flightDetails?: string;
  travelInterests: string[];
  placesToVisit?: string;
  accommodationType: string[];
  preferredRoomType: string;
  specialNeeds?: string;
  transportPreference: string[];
  airportPickupDrop: boolean;
  mealPlan: string[];
  tourGuideNeeded: string;
  specialRequests?: string;
  preferredLanguage: string;
  budget: string;
}

const AdminCustomizedPlanDetails: React.FC = () => {
  // 🔄 Grab the `id` param from the URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 🔄 Local state for the fetched request, loading & error
  const [request, setRequest] = useState<RequestType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Fetch the request on mount (or when `id` changes)
  useEffect(() => {
    if (!id) {
      navigate("/api/toures/requests");
      return;
    }

    getCustomTourRequestById(id)
      .then((res) => {
        setRequest(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // 🔄 Show loading spinner/text
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading details…</p>
      </div>
    );
  }

  // 🔄 Show error if fetch failed or no data
  if (error || !request) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error || "Not found"}</p>
      </div>
    );
  }

  // 🔄 Destructure fields for easy use
  const {
    _id,
    fullName,
    country,
    email,
    whatsappNumber,
    numberOfAdults,
    numberOfChildren,
    arrivalDate,
    departureDate,
    daysToTravel,
    flightDetails,
    travelInterests,
    placesToVisit,
    accommodationType,
    preferredRoomType,
    specialNeeds,
    transportPreference,
    airportPickupDrop,
    mealPlan,
    tourGuideNeeded,
    specialRequests,
    preferredLanguage,
    budget,
  } = request;

  return (
    <div className="max-w-4xl mx-auto mb-16 overflow-hidden shadow-sm pt-20 relative z-10">
      {/* ─── Top Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-[#23263A] px-6 py-4 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Travel Booking Sri Lanka"
            className="w-10 h-10 rounded-full bg-white"
          />
          <span className="font-semibold text-sky-300 text-base">
            Travel Booking Sri Lanka
          </span>
        </div>
        <span className="text-white text-sm font-medium">
          Sri Lanka’s best travelling organizer
        </span>
      </div>

      {/* ─── Main Content ────────────────────────────────────── */}
      <div className="p-8 bg-white rounded-b-2xl border-x border-b border-gray-300">
        {/* User Info */}
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-6">
          <img
            src={userImg}
            alt={fullName}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {fullName}
            </h2>
            <div className="text-gray-700 mb-1">ID: {_id}</div>
            <div className="text-gray-700 mb-1">{country}</div>
            <div className="text-gray-700 mb-1">{email}</div>
            <div className="text-gray-700 mb-1">{whatsappNumber}</div>
          </div>
        </div>

        {/* Plan Summary */}
        <div className="flex flex-col md:flex-row gap-8 mb-6 border-t border-gray-200 pt-6">
          <div className="flex-1 space-y-1 text-gray-700">
            <div>
              No. of Adults:{" "}
              <span className="font-semibold">{numberOfAdults}</span>
            </div>
            <div>
              No. of Children:{" "}
              <span className="font-semibold">{numberOfChildren}</span>
            </div>
            <div>
              Arrival Date:{" "}
              <span className="font-semibold">
                {new Date(arrivalDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              Departure Date:{" "}
              <span className="font-semibold">
                {new Date(departureDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              No. of Days: <span className="font-semibold">{daysToTravel}</span>
            </div>
            <div>
              No. of Nights:{" "}
              <span className="font-semibold">{daysToTravel - 1}</span>
            </div>
          </div>
          <div className="flex-1 text-right text-xl font-bold text-sky-500">
            Plan Price: <span className="text-[#0099E5]">{budget}</span>
          </div>
        </div>

        {/* Flight Details */}
        {flightDetails && (
          <div className="mb-6">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              Flight details
            </h3>
            <p className="text-gray-700 text-sm">{flightDetails}</p>
          </div>
        )}

        {/* Travel Interests & Places */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            Travel details
          </h3>
          <div className="text-gray-700 text-sm mb-1">
            <span className="font-semibold">Interests:</span>{" "}
            {travelInterests.join(", ")}
          </div>
          {placesToVisit && (
            <div className="text-gray-700 text-sm">
              <span className="font-semibold">Places to Visit:</span>{" "}
              {placesToVisit}
            </div>
          )}
        </div>

        {/* Accommodation */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            Accommodation details
          </h3>
          <div className="text-gray-700 text-sm mb-1">
            <span className="font-semibold">Type:</span>{" "}
            {accommodationType.join(", ")}
          </div>
          <div className="text-gray-700 text-sm mb-1">
            <span className="font-semibold">Room:</span> {preferredRoomType}
          </div>
          {specialNeeds && (
            <div className="text-gray-700 text-sm">
              <span className="font-semibold">Special Needs:</span>{" "}
              {specialNeeds}
            </div>
          )}
        </div>

        {/* Transport */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            Transport details
          </h3>
          <div className="text-gray-700 text-sm mb-1">
            <span className="font-semibold">Preference:</span>{" "}
            {transportPreference.join(", ")}
          </div>
          <div className="text-gray-700 text-sm">
            <span className="font-semibold">Airport Pickup/Drop:</span>{" "}
            {airportPickupDrop ? "Yes" : "No"}
          </div>
        </div>

        {/* Other Details */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            Other details
          </h3>
          <div className="text-gray-700 text-sm mb-1">
            <span className="font-semibold">Meal Plan:</span>{" "}
            {mealPlan.join(", ")}
          </div>
          <div className="text-gray-700 text-sm mb-1">
            <span className="font-semibold">Tour Guide:</span> {tourGuideNeeded}
          </div>
          {specialRequests && (
            <div className="text-gray-700 text-sm mb-1">
              <span className="font-semibold">Special Requests:</span>{" "}
              {specialRequests}
            </div>
          )}
          <div className="text-gray-700 text-sm">
            <span className="font-semibold">Language:</span> {preferredLanguage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomizedPlanDetails;
