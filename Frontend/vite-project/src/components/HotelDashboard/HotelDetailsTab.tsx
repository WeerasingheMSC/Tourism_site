
import React, { useState } from 'react';

interface HotelDetailsTabProps {
  onNext: () => void;
  onBack: () => void;
  onValidationError: (message: string) => void;
}

const HotelDetailsTab: React.FC<HotelDetailsTabProps> = ({ onNext, onBack, onValidationError }) => {
  // State for form data
  const [formData, setFormData] = useState({
    hotelName: '',
    address: '',
    area: '',
    district: 'Colombo',
    hotelType: 'Luxury hotel',
    description: '',
    uploadedFiles: [] as File[],
    locationSelected: false
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }));
  };

  // Remove uploaded file
  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  };

  // Validate form
  const validateForm = () => {
    const { hotelName, address, area, description, locationSelected } = formData;
    return hotelName.trim() && address.trim() && area.trim() && description.trim() && 
           formData.uploadedFiles.length > 0 && locationSelected;
  };

  // Handle next button
  const handleNext = () => {
    if (!validateForm()) {
      onValidationError('Please fill all required fields, upload at least one hotel picture, and select a location before proceeding');
      return;
    }
    onValidationError(''); // Clear any previous errors
    onNext();
  };

  // Handle location selection
  const handleLocationSelect = () => {
    // Simulate location selection
    setFormData(prev => ({
      ...prev,
      locationSelected: true
    }));
    alert('Location selected successfully!');
  };
  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Hotel Detail</h2>
      <p className="text-gray-600 mb-6">Enter your Hotel information</p>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel Name
            </label>
            <input
              type="text"
              required
              value={formData.hotelName}
              onChange={(e) => handleInputChange('hotelName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area
            </label>
            <input
              type="text"
              required
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <select 
              required
              value={formData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Colombo</option>
              <option>Gampaha</option>
              <option>Kalutara</option>
              <option>Kandy</option>
              <option>Matale</option>
              <option>Nuwara Eliya</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel type
            </label>
            <select 
              required
              value={formData.hotelType}
              onChange={(e) => handleInputChange('hotelType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Luxury hotel</option>
              <option>Boutique Hotel</option>
              <option>Resort</option>
              <option>Guest House</option>
              <option>Villa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Small Description
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Map Integration <span className="text-red-500">*</span>
            </label>
            <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
              formData.locationSelected ? 'border-green-300 bg-green-50' : 'border-gray-300'
            }`}>
              <button 
                type="button"
                onClick={handleLocationSelect}
                className={`px-6 py-2 rounded-lg font-medium ${
                  formData.locationSelected 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {formData.locationSelected ? 'Location Selected ✓' : 'Select the location'}
              </button>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel Pictures <span className="text-red-500">*</span>
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 hover:border-blue-400 transition-colors ${
              formData.uploadedFiles.length > 0 ? 'border-green-300 bg-green-50' : 'border-gray-300'
            }`}>
              <input
                type="file"
                multiple
                accept="image/*"
                required
                onChange={handleFileUpload}
                className="hidden"
                id="hotel-pictures"
              />
              <label htmlFor="hotel-pictures" className="cursor-pointer block w-full">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 text-gray-400 mb-4 flex items-center justify-center">
                    {formData.uploadedFiles.length > 0 ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8 text-green-500">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    {formData.uploadedFiles.length > 0 ? 'Images uploaded successfully!' : 'Click to upload images'}
                  </p>
                  <p className="text-xs text-gray-500">Or drag and drop files</p>
                </div>
              </label>
            </div>

            {/* Display uploaded files */}
            {formData.uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                <div className="space-y-2">
                  {formData.uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
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
        
        <div className="flex justify-between mt-8">
          <button 
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 font-medium"
          >
            Back
          </button>
          <button 
            onClick={handleNext}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium"
          >
            Next
          </button>
        </div>
    </div>
  );
};

export default HotelDetailsTab;
