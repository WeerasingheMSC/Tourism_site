// src/pages/IndividualPackage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 🔄 1) Import your API helper to fetch a single package by ID
import { getPackageById } from "../../../api/packages"; // :contentReference[oaicite:0]{index=0}
import Decore from "../../Packages/Decore";

interface DailyPlan {
  day: number;
  title: string;
  description?: string;
  items?: string[];
}

interface PackageData {
  name: string;
  theme: string;
  description: string[];
  idealFor: string[];
  startingPrice: string;
  packageIcon: string;
  packagePhotos: string[];
  dailyPlans: DailyPlan[];
  includedItems: { label: string; detail?: string }[];
  notIncludedItems: { label: string; detail?: string }[];
}

const IndividualPackage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 🔄 2) Add state for your real package data, loading & error
  const [pkg, setPkg] = useState<PackageData | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 3) Fetch package data on mount (and whenever `id` changes)
  useEffect(() => {
    if (!id) {
      navigate("/packages");
      return;
    }
    setLoading(true);

    getPackageById(id)
      .then((res) => {
        const data = res.data;
        // 🔄 3.1) Map API fields into our PackageData shape
        setPkg({
          name: data.name,
          theme: data.theme,
          description: data.description,
          idealFor: data.idealFor,
          startingPrice: data.startingPrice,
          packageIcon: data.packageIcon,
          packagePhotos: data.packagePhotos,
          dailyPlans: data.dailyPlans,
          includedItems: data.includedItems.map((item: string) => ({ label: item })),
          notIncludedItems: data.notIncludedItems.map((item: string) => ({ label: item })),
        });
        // 🔄 3.2) Initialize the main image
        setMainImage(data.packagePhotos[0] || data.packageIcon);
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  // 🔄 4) Show loading / error if needed
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading package…</p>
      </div>
    );
  }
  if (error || !pkg) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error || "Not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gray-50">
      <Decore />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-25">
        {/* ─── Gallery & Info ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <img
                src={mainImage}
                alt={pkg.name}
                className="w-full h-96 object-cover rounded-xl transition-all duration-300"
              />
            </div>
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {/* 🔄 Map real photos */}
              {(pkg.packagePhotos || []).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`focus:outline-none border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                    mainImage === img
                      ? "border-blue-600"
                      : "border-transparent hover:border-blue-300"
                  }`}
                  type="button"
                >
                  <img
                    src={img}
                    alt={`${pkg.name} thumbnail ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Package Info */}
          <div className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-blue-400">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16">
                <img
                  src={pkg.packageIcon}
                  alt={pkg.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{pkg.name}</h1>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-gray-600 font-medium">Duration:</span>
                <span className="ml-2 text-gray-900">
                  {/* if you have duration in data, replace here */}
                </span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Theme:</span>
                <span className="ml-2 text-gray-900">{pkg.theme}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Ideal For:</span>
                <span className="ml-2 text-gray-900">
                  {pkg.idealFor.join(", ")}
                </span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Starting Price:</span>
                <span className="ml-2 text-blue-600 font-bold text-xl">
                  {pkg.startingPrice}
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{pkg.description}</p>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Reserve Now
            </button>
          </div>
        </div>

        {/* ─── Agenda Section ───────────────────────────── */}
        <div className="mt-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            our agenda for the plan
          </h2>
          <div className="space-y-8 border-3 border-gray-100 rounded-lg p-6">
            {/* 🔄 Map real daily plans */}
            {(pkg.dailyPlans || []).map((day, idx) => (
              <div
                key={idx}
                className={`flex ${
                  idx < pkg.dailyPlans.length - 1
                    ? "border-b-3 border-gray-100 pb-5"
                    : "pb-5"
                }`}
              >
                <div className="w-1/2 pl-6 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {day.title}
                  </h3>
                  <p className="text-gray-600 mb-0">( Day {day.day} )</p>
                </div>
                <div className="w-1/2 pl-6">
                  <ul className="space-y-2 text-gray-700">
                    {Array.isArray(day.description)
                      ? day.description.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))
                      : day.description
                      ? <li>{day.description}</li>
                      : null}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── What's Included / Not Included ───────────────────────────── */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* What's Included */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-3 border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              What's Included
            </h3>
            <ul className="space-y-3">
              {/* 🔄 Map real includedItems */}
              {pkg.includedItems.map((inc, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="font-medium text-gray-900">
                    {inc.label}
                  </span>
                  {inc.detail && (
                    <span className="text-gray-600"> {inc.detail}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* What's Not Included */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-3 border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              What's Not Included
            </h3>
            <ul className="space-y-3">
              {/* 🔄 Map real notIncludedItems */}
              {pkg.notIncludedItems.map((inc, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-gray-900">{inc.label}</span>
                  {inc.detail && (
                    <span className="text-gray-600"> {inc.detail}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualPackage;
