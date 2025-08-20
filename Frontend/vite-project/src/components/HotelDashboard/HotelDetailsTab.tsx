// src/components/HotelDetailsTab.tsx
"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "300px" };

// 1️⃣ Define the exact shape of your hotelDetails object
export interface HotelDetails {
  name: string;
  description: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  phone: string;
  email: string;
  website: string;
  starRating: string;
  images: File[];
}

// 2️⃣ Props now use that type exactly
export interface HotelDetailsTabProps {
  details: HotelDetails;
  setDetails: React.Dispatch<React.SetStateAction<HotelDetails>>;
}

const HotelDetailsTab: React.FC<HotelDetailsTabProps> = ({
  details,
  setDetails,
}) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [markerPos, setMarkerPos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
  });

  const handleInputChange = (field: keyof HotelDetails, value: string) => {
    setDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPos({ lat, lng });
    setDetails((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDetails((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeFile = (index: number) => {
    setDetails((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const renderMapModalContent = () => {
    if (loadError) return <p className="text-red-500">Error loading map</p>;
    if (!isLoaded) return <p className="text-gray-700">Loading map...</p>;
    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPos ?? { lat: 7.8731, lng: 80.7718 }}
        zoom={markerPos ? 12 : 6}
        onClick={onMapClick}
      >
        {markerPos && <Marker position={markerPos} />}
      </GoogleMap>
    );
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Hotel Detail</h2>
      <p className="text-gray-600 mb-6">Enter your Hotel information</p>

      <div className="grid grid-cols-2 gap-6">
        {/* Hotel Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hotel Name
          </label>
          <input
            type="text"
            required
            value={details.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Street */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          {/* Street */}
          <div>
            <input
              type="text"
              required
              placeholder="Street"
              value={details.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              className="w-xs mb-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        
          {/* City */}
          <div>
            <input
              type="text"
              required
              placeholder="City"
              value={details.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-xs mb-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* State */}
          <div>
            <input
              type="text"
              required
              placeholder="State"
              value={details.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-xs mb-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Country */}
          <div>
            <input
              type="text"
              required
              placeholder="Country"
              value={details.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-xs mb-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* PostalCode */}
          <div>
            <input
              type="text"
              required
              placeholder="Postal Code"
              value={details.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              className="w-xs mb-2 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Small Description
          </label>
          <input
            type="text"
            required
            value={details.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Map */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Map Integration
          </label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <button
              onClick={() => setShowMapModal(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Select the location
            </button>
          </div>
          {details.latitude && details.longitude && (
            <p className="mt-2 text-sm text-gray-700">
              Selected: {details.latitude}, {details.longitude}
            </p>
          )}
        </div>

        {/* Pictures */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hotel Pictures
          </label>
          <div className="border-2 border-dashed rounded-lg p-6 hover:border-blue-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="hotel-pictures"
            />
            <label htmlFor="hotel-pictures" className="cursor-pointer block">
              <div className="text-center">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 mx-auto mb-4 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload images
                </p>
                <p className="text-xs text-gray-500">Or drag and drop files</p>
              </div>
            </label>
          </div>
          {details.images.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Uploaded Files:
              </h4>
              <div className="space-y-2">
                {details.images.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Modal */}
      {showMapModal &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-4 w-full max-w-lg max-h-full overflow-auto">
              {renderMapModalContent()}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowMapModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default HotelDetailsTab;
