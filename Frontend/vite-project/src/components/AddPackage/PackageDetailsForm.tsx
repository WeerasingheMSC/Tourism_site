import React, { useState } from 'react';
import Decore from '../Packages/Decore';
import PackageDetailsTab from './PackageDetailsTab';
import DailyAgendaTab from './DailyAgendaTab';
import IncludeNotIncludeTab from './IncludeNotIncludeTab';
import { packageAPI } from '../../api/packages';
import type { CreatePackageRequest, BackendDailyPlan, BackendPackageItem } from '../../api/packages';

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
    name: '',
    theme: '',
    description: '',
    idealFor: [],
    startingPrice: '29.99',
    packageIcon: null,
    packagePhotos: [],
    dailyPlans: []
  });

  const [activeTab, setActiveTab] = useState('Package details');
  const [includedItems, setIncludedItems] = useState<PackageItem[]>([]);
  const [notIncludedItems, setNotIncludedItems] = useState<PackageItem[]>([]);
  
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Transform frontend data to backend format
  const transformDataForBackend = (): CreatePackageRequest => {
    // Transform daily plans (remove id, ensure activities and locations are arrays)
    const backendDailyPlans: BackendDailyPlan[] = formData.dailyPlans.map(plan => ({
      day: plan.day,
      title: plan.title,
      description: plan.description,
      activities: plan.activities || [],
      locations: plan.locations || []
    }));

    // Transform package items (remove id)
    const backendIncludedItems: BackendPackageItem[] = includedItems.map(item => ({
      text: item.text
    }));

    const backendNotIncludedItems: BackendPackageItem[] = notIncludedItems.map(item => ({
      text: item.text
    }));

    return {
      name: formData.name.trim(),
      theme: formData.theme.trim(),
      description: formData.description.trim(),
      idealFor: formData.idealFor,
      startingPrice: parseFloat(formData.startingPrice),
      dailyPlans: backendDailyPlans,
      includedItems: backendIncludedItems,
      notIncludedItems: backendNotIncludedItems,
      status: 'draft' // Default to draft
    };
  };

  // Enhanced validation function
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Basic field validation
    if (!formData.name.trim()) errors.push('Package name is required');
    if (!formData.theme.trim()) errors.push('Theme is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (formData.idealFor.length === 0) errors.push('At least one "ideal for" option must be selected');
    if (formData.idealFor.length > 4) errors.push('Cannot select more than 4 "ideal for" options');
    
    // Price validation
    const price = parseFloat(formData.startingPrice);
    if (isNaN(price) || price < 0) errors.push('Starting price must be a valid positive number');

    // File validation
    if (!formData.packageIcon) errors.push('Package icon is required');
    if (formData.packagePhotos.length === 0) errors.push('At least one package photo is required');

    // Daily plans validation
    if (formData.dailyPlans.length === 0) errors.push('At least one daily plan is required');
    
    // Validate each daily plan
    formData.dailyPlans.forEach((plan, index) => {
      if (!plan.title.trim()) errors.push(`Daily plan ${index + 1}: Title is required`);
      if (!plan.description.trim()) errors.push(`Daily plan ${index + 1}: Description is required`);
    });

    // Check for duplicate days
    const days = formData.dailyPlans.map(plan => plan.day);
    const duplicateDays = days.filter((day, index) => days.indexOf(day) !== index);
    if (duplicateDays.length > 0) {
      errors.push(`Duplicate day numbers found: ${[...new Set(duplicateDays)].join(', ')}`);
    }

    // File type validation
    if (formData.packageIcon && !formData.packageIcon.type.startsWith('image/')) {
      errors.push('Package icon must be an image file');
    }

    // Photo validation
    const invalidPhotos = formData.packagePhotos.filter(photo => !photo.type.startsWith('image/'));
    if (invalidPhotos.length > 0) {
      errors.push('All package photos must be image files');
    }

    if (formData.packagePhotos.length > 30) {
      errors.push('Cannot upload more than 30 photos');
    }

    return { isValid: errors.length === 0, errors };
  };

  // Submit handler
  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      setSubmitError(`Please fix the following errors:\n• ${validation.errors.join('\n• ')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform data for backend
      const backendData = transformDataForBackend();

      // Prepare files
      const files = {
        packageIcon: formData.packageIcon || undefined,
        packagePhotos: formData.packagePhotos.length > 0 ? formData.packagePhotos : undefined
      };

      // Submit to backend
      const response = await packageAPI.createPackage(backendData, files);

      if (response.success) {
        setSubmitSuccess(true);
        setSubmitError(null);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: '',
            theme: '',
            description: '',
            idealFor: [],
            startingPrice: '29.99',
            packageIcon: null,
            packagePhotos: [],
            dailyPlans: []
          });
          setIncludedItems([]);
          setNotIncludedItems([]);
          setActiveTab('Package details');
          setSubmitSuccess(false);
        }, 3000);
        
        alert('Package created successfully!');
      } else {
        throw new Error(response.message || 'Failed to create package');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      
      // Handle different types of errors
      if (error.message) {
        setSubmitError(error.message);
      } else if (error.errors && Array.isArray(error.errors)) {
        setSubmitError(`Validation errors:\n• ${error.errors.join('\n• ')}`);
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const validation = validateForm();
    return validation.isValid;
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

        {/* Error Display */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="text-red-600 text-sm whitespace-pre-line">
                {submitError}
              </div>
            </div>
          </div>
        )}

        {/* Success Display */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-600 text-sm">
              Package created successfully! Redirecting...
            </div>
          </div>
        )}

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
                disabled={isSubmitting}
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
                setFormData((prev) => ({ 
                  ...prev, 
                  dailyPlans: Array.isArray(plans) ? plans : plans(prev.dailyPlans) 
                }))
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
              ${tabs.indexOf(activeTab) === 0 || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}
            disabled={tabs.indexOf(activeTab) === 0 || isSubmitting}
          >
            Back
          </button>
          
          <button
            type="button"
            onClick={() => {
              const idx = tabs.indexOf(activeTab);
              if (activeTab === 'Include & Not include details') {
                handleSubmit();
              } else if (idx < tabs.length - 1) {
                setActiveTab(tabs[idx + 1]);
              }
            }}
            className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2
              ${activeTab === 'Include & Not include details'
                ? isFormValid() && !isSubmitting
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : tabs.indexOf(activeTab) === tabs.length - 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            disabled={
              ((activeTab === 'Include & Not include details' && (!isFormValid() || isSubmitting)) ||
              (tabs.indexOf(activeTab) === tabs.length - 1 && activeTab !== 'Include & Not include details')) ||
              isSubmitting
            }
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            {activeTab === 'Include & Not include details' 
              ? isSubmitting ? 'Creating...' : 'Submit' 
              : 'Next'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPackagesForm;