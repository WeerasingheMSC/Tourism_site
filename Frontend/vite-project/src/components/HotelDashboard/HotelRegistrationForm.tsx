// src/components/HotelRegistrationForm.tsx

import React, { useState } from "react";
import HotelOwnerDetails from "./HotelOwnerDetails";
import HotelDetailsTab from "./HotelDetailsTab";
import HotelRulesTab from "./HotelRulesTab";
import FAQFacilitiesTab, { type RoomType } from "./FAQFacilitiesTab";
import { uploadFileAndGetURL } from "../../firebase";
import type { HotelRegistrationData } from "../../api/hotel";
import { registerHotel } from "../../api/hotel";

type Tab = "profile" | "hotel-details" | "hotel-rules" | "faq-facilities";

const HotelRegistrationForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // 1️⃣ Profile tab state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "English",
    profilePicture: null as File | null,
  });

  // 2️⃣ Hotel Details tab state
  const [hotelDetails, setHotelDetails] = useState({
    name: "",
    description: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    phone: "",
    email: "",
    website: "",
    starRating: "",
    images: [] as File[],
  });

  // 3️⃣ Rules/Policies tab state
  const [rules, setRules] = useState({
    checkIn: "",
    checkOut: "",
    cancellationPolicy: "",
    childrenAndBeds: "",
    ageFrom: "1",
    ageTo: "60",
    petsAllowed: false,
    paymentMethods: [] as string[],
  });

  // 4️⃣ FAQs, Facilities & Room Types tab state
  const [facilities, setFacilities] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<
    { id: number; question: string; answer: string }[]
  >([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const tabs: Tab[] = [
    "profile",
    "hotel-details",
    "hotel-rules",
    "faq-facilities",
  ];
  const idx = tabs.indexOf(activeTab);
  const nextTab = () => idx < tabs.length - 1 && setActiveTab(tabs[idx + 1]);
  const prevTab = () => idx > 0 && setActiveTab(tabs[idx - 1]);

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      // 1) Upload images to Firebase
      const imageUrls = await Promise.all(
        hotelDetails.images.map((file) =>
          uploadFileAndGetURL(file, "hotelImages")
        )
      );

      // 2) Build payload with explicit type annotation
      const payload: HotelRegistrationData = {
        name: hotelDetails.name,
        description: hotelDetails.description,
        address: {
          street: hotelDetails.street,
          city: hotelDetails.city,
          state: hotelDetails.state,
          country: hotelDetails.country,
          postalCode: hotelDetails.postalCode,
          geoLocation: {
            type: "Point",
            coordinates: [
              parseFloat(hotelDetails.longitude),
              parseFloat(hotelDetails.latitude),
            ] as [number, number],
          },
        },
        contact: {
          phone: hotelDetails.phone || profileData.phone,
          email: hotelDetails.email || profileData.email,
          website: hotelDetails.website,
        },
        amenities: facilities,
        starRating: parseFloat(hotelDetails.starRating),
        roomTypes: roomTypes.map((rt) => ({
          name: rt.name,
          description: rt.description,
          pricePerNight: rt.pricePerNight,
          totalRooms: rt.totalRooms,
          amenities: rt.amenities,
          maxOccupancy: rt.maxOccupancy,
        })),
        images: imageUrls,
        policies: {
          checkInTime: rules.checkIn,
          checkOutTime: rules.checkOut,
          cancellationPolicy: rules.cancellationPolicy,
          childrenAndBeds: rules.childrenAndBeds,
          ageRestriction: `${rules.ageFrom}-${rules.ageTo}`,
          petsAllowed: rules.petsAllowed,
        },
        faqs: faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
      };

      // 3) Call your centralized API helper
      const res = await registerHotel(payload);

      setSubmitSuccess(res.message);
    }catch (err: any) {
  console.error(
    "registerHotel validation error:",
    JSON.stringify(err.response?.data, null, 2)
  )
  setSubmitError(JSON.stringify(err.response?.data, null, 2))
}
 finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="min-h-screen relative z-10">
      <div className=" relative z-10 max-w-3xl mx-auto mt-19 px-6 py-8 backdrop-blur rounded-xl shadow-sm">
      {/* Tab navigation */}
      <div className="rounded-xl shadow-sm mb-8  mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${
              activeTab === tab ? "border-b-2 border-blue-600" : "text-gray-500"
            }`}
          >
            {tab.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "profile" && (
        <HotelOwnerDetails
          profileData={profileData}
          setProfileData={setProfileData}
        />
      )}
      {activeTab === "hotel-details" && (
        <HotelDetailsTab details={hotelDetails} setDetails={setHotelDetails} />
      )}
      {activeTab === "hotel-rules" && (
        <HotelRulesTab rules={rules} setRules={setRules} />
      )}
      {activeTab === "faq-facilities" && (
        <FAQFacilitiesTab
          facilities={facilities}
          setFacilities={setFacilities}
          faqs={faqs}
          setFaqs={setFaqs}
          roomTypes={roomTypes}
          setRoomTypes={setRoomTypes}
        />
      )}

      {/* Back / Next / Submit */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevTab}
          disabled={idx === 0 || isSubmitting}
          className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 font-medium"
        >
          Back
        </button>
        {idx < tabs.length - 1 ? (
          <button
            onClick={nextTab}
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 font-medium"
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </button>
        )}
      </div>

      {/* Feedback */}
      {submitError && <p className="mt-4 text-red-600">{submitError}</p>}
      {submitSuccess && <p className="mt-4 text-green-600">{submitSuccess}</p>}
    </div>
    </div>
  );
};

export default HotelRegistrationForm;
