import React, { useState } from 'react';
import Decore from '../Packages/Decore';
import PackageDetailsTab from '../AddPackage/PackageDetailsTab';
import DailyAgendaTab from '../AddPackage/DailyAgendaTab';
import IncludeNotIncludeTab from '../AddPackage/IncludeNotIncludeTab';

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
  dailyPlans: DailyPlan[]; // <-- Add this line
}

const EditPackagesForm: React.FC = () => {
  const [formData, setFormData] = useState<PackageFormData>({
    name: '',
    theme: '',
    description: '',
    idealFor: [],
    startingPrice: '29.99',
    packageIcon: null,
    packagePhotos: [],
    dailyPlans: [] // <-- Add this line
  });

  const [activeTab, setActiveTab] = useState('Package details');

  // Add these to your parent state
  const [includedItems, setIncludedItems] = useState<PackageItem[]>([]);
  const [notIncludedItems, setNotIncludedItems] = useState<PackageItem[]>([]);

  // Validation function
  const isFormValid = () => {
    // Basic validation for all fields
    console.log(formData);
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

  const idealForOptions = [
    'Young travelers', 'surfers', 'backpackers', 'Pilgrims', 'seniors', 'spiritual seekers', 'Firsttime visitors',
    'groups', 'Families', 'couples', 'mixed-interest groups', 'photographers', 'Natural lovers',
    'beach lovers', 'solo travelers', 'local explorers', 'Honeymooners', 'special event', 'anniversary couples',
    'students', 'History lovers'
  ];

  const tabs = ['Package details', 'Daily Agenda', 'Include & Not include details'];

  return (
    <div className="min-h-screen relative">
      {/* Background Decoration */}
      <Decore />
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-25 relative z-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Add Packages</h1>

        <div className="rounded-lg shadow-lg bg-white/30 backdrop-blur isolate">
          {/* Tabs */}
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === tab
                    ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form Content */}
          {activeTab === 'Package details' && (
            <PackageDetailsTab
              formData={formData}
              setFormData={setFormData}
              idealForOptions={idealForOptions}
            />
          )}

          {activeTab === 'Daily Agenda' && (
            <DailyAgendaTab
              dailyPlans={formData.dailyPlans}
              setDailyPlans={(plans) =>
                setFormData((prev) => ({ ...prev, dailyPlans: Array.isArray(plans) ? plans : plans(prev.dailyPlans) }))
              }
            />
          )}

          {activeTab === 'Include & Not include details' && (
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
            onClick={() => {
              const idx = tabs.indexOf(activeTab);
              if (idx > 0) setActiveTab(tabs[idx - 1]);
            }}
            className={`border border-blue-500 text-blue-500 px-6 py-2 rounded-md font-medium transition-colors
              ${tabs.indexOf(activeTab) === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}
            disabled={tabs.indexOf(activeTab) === 0}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              const idx = tabs.indexOf(activeTab);
              if (activeTab === 'Include & Not include details') {
                if (!isFormValid()) {
                  alert('Please fill in all required fields before submitting.');
                  return;
                }
                // Submit logic here
                alert('Form submitted!');
              } else if (idx < tabs.length - 1) {
                setActiveTab(tabs[idx + 1]);
              }
            }}
            className={`px-6 py-2 rounded-md font-medium transition-colors
              ${activeTab === 'Include & Not include details'
                ? isFormValid()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : tabs.indexOf(activeTab) === tabs.length - 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            disabled={
              (activeTab === 'Include & Not include details' && !isFormValid()) ||
              tabs.indexOf(activeTab) === tabs.length - 1 && activeTab !== 'Include & Not include details'
            }
          >
            {activeTab === 'Include & Not include details' ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPackagesForm;