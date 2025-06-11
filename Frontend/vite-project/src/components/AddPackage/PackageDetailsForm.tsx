// src/components/AddPackagesForm.tsx
import React, { useState } from "react";
import Decor from "../Packages/Decore";
import PackageDetailsTab from "../AddPackage/PackageDetailsTab";
import DailyAgendaTab from "./DailyAgendaTab";
import IncludeNotIncludeTab from "./IncludeNotIncludeTab";
import { uploadFileAndGetURL } from "../../firebase";
import { addPackage } from "../../api/packages";

interface DailyPlan {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: string[];
  locations: string[];
}

interface PackageItem {
  id: string;
  text: string;
}

interface PackageFormData {
  name: string;
  theme: string;
  description: string;
  idealFor: string[];
  startingPrice: string;
  packageIcon: File | null;
  packagePhotos: File[];
  dailyPlans: DailyPlan[];
}

const AddPackagesForm: React.FC = () => {
  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    theme: "",
    description: "",
    idealFor: [],
    startingPrice: "",
    packageIcon: null,
    packagePhotos: [],
    dailyPlans: [],
  });

  const [includedItems, setIncludedItems] = useState<PackageItem[]>([]);
  const [notIncludedItems, setNotIncludedItems] = useState<PackageItem[]>([]);
  const [activeTab, setActiveTab] = useState("Package details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // NEW: message states
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tabs = [
    "Package details",
    "Daily Agenda",
    "Include & Not include details",
  ];

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.theme.trim() &&
      formData.description.trim() &&
      formData.idealFor.length > 0 &&
      formData.startingPrice.trim() &&
      formData.packageIcon &&
      formData.packagePhotos.length > 0 &&
      formData.dailyPlans.length > 0
    );
  };

  const nextTab = () => {
    const idx = tabs.indexOf(activeTab);
    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
  };

  const prevTab = () => {
    const idx = tabs.indexOf(activeTab);
    if (idx > 0) setActiveTab(tabs[idx - 1]);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // 1) Upload packageIcon
      let iconUrl = "";
      if (formData.packageIcon) {
        iconUrl = await uploadFileAndGetURL(
          formData.packageIcon,
          "packageIcons"
        );
      }

      // 2) Upload photos
      const photoUrls = await Promise.all(
        formData.packagePhotos.map((file) =>
          uploadFileAndGetURL(file, "packagePhotos")
        )
      );

      // 3) Build payload
      const payload = {
        name: formData.name,
        theme: formData.theme,
        description: formData.description,
        idealFor: formData.idealFor,
        startingPrice: formData.startingPrice,
        packageIcon: iconUrl,
        packagePhotos: photoUrls,
        dailyPlans: formData.dailyPlans,
        includedItems: includedItems.map((i) => i.text),
        notIncludedItems: notIncludedItems.map((i) => i.text),
      };

      // 4) Send to backend
      await addPackage(payload);
      console.log("Package added successfully!");
      // On success: show popup
      setSuccessMessage("Package created successfully!");
      // Optionally reset or redirect...
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMessage(err.response?.data?.message || err.message);
      setSubmitError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // NEW: Modal UI (reused for both success & error)
  const Modal: React.FC<{ message: string; onClose: () => void }> = ({
    message,
    onClose,
  }) => (
    <div
      className="fixed inset-0 flex items-center justify-center z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-white border-cyan-500 border rounded-lg p-6 max-w-sm w-full mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-gray-800 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      <Decor />
      <div className="max-w-4xl mx-auto px-4 py-25 relative z-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Add Packages
        </h1>

        <div className="rounded-lg shadow-lg bg-white/30 backdrop-blur isolate">
          {/* Tabs */}
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === tab
                    ? "text-blue-500 border-b-2 border-blue-500 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "Package details" && (
            <PackageDetailsTab
              formData={formData}
              setFormData={setFormData}
              idealForOptions={[
                "Young travelers",
                "Surfers",
                "Backpackers",
                "Pilgrims",
                "Seniors",
                "Spiritual seekers",
                "First-time visitors",
                "Groups",
                "Families",
                "Couples",
                "Mixed-interest groups",
                "Photographers",
                "Natural lovers",
                "Beach lovers",
                "Solo travelers",
                "Local explorers",
                "Honeymooners",
                "Special event",
                "Anniversary couples",
                "Students",
                "History lovers",
              ]}
            />
          )}

          {activeTab === "Daily Agenda" && (
            <DailyAgendaTab
              dailyPlans={formData.dailyPlans}
              setDailyPlans={(plans) =>
                setFormData((prev) => ({
                  ...prev,
                  dailyPlans: Array.isArray(plans)
                    ? plans
                    : plans(prev.dailyPlans),
                }))
              }
            />
          )}

          {activeTab === "Include & Not include details" && (
            <IncludeNotIncludeTab
              includedItems={includedItems}
              setIncludedItems={setIncludedItems}
              notIncludedItems={notIncludedItems}
              setNotIncludedItems={setNotIncludedItems}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 px-6 py-4 bg-transparent">
          <button
            type="button"
            onClick={prevTab}
            disabled={tabs.indexOf(activeTab) === 0}
            className={`border border-blue-500 text-blue-500 px-6 py-2 rounded-md font-medium transition-colors ${
              tabs.indexOf(activeTab) === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-50"
            }`}
          >
            Back
          </button>

          <button
            type="button"
            onClick={
              activeTab === tabs[tabs.length - 1] ? handleSubmit : nextTab
            }
            disabled={
              (activeTab === tabs[tabs.length - 1] && !isFormValid()) ||
              (activeTab !== tabs[tabs.length - 1] &&
                tabs.indexOf(activeTab) === tabs.length - 1)
            }
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === tabs[tabs.length - 1]
                ? isFormValid()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {activeTab === tabs[tabs.length - 1] ? "Submit" : "Next"}
          </button>
        </div>

        {/* Error & Success Popups */}
        {successMessage && (
          <Modal
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}
        {errorMessage && (
          <Modal message={errorMessage} onClose={() => setErrorMessage(null)} />
        )}
      </div>
    </div>
  );
};

export default AddPackagesForm;
