import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../../api/vehicleBookings';
import { ensureAuthForTesting } from '../../utils/authHelper';
import { uploadFileAndGetURL } from '../../firebase';
import { message } from 'antd';

const RegisterVehicle = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Info
    vehicleType: '',
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    // Details
    capacity: '',
    fuelType: '',
    transmission: '',
    color: '',
    mileage: '',
    // Pricing & Rules
    rentalType: 'Per day',
    price: '',
    minimumRental: '',
    description: '',
    // Images
    images: [] as string[]
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    // Limit to 5 images maximum
    const maxImages = 5;
    const availableSlots = maxImages - formData.images.length;
    const filesToUpload = files.slice(0, availableSlots);
    
    if (files.length > availableSlots) {
      message.warning(`You can only upload ${availableSlots} more images. Maximum is ${maxImages} images.`);
    }
    
    try {
      setLoading(true);
      message.loading('Uploading images...');
      
      // Upload files to Firebase and get URLs
      const uploadPromises = filesToUpload.map(file => 
        uploadFileAndGetURL(file, "vehicleImages")
      );
      
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Add the uploaded URLs to the form data
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      
      message.success(`Successfully uploaded ${uploadedUrls.length} image(s)!`);
      
    } catch (error) {
      console.error('Error uploading images:', error);
      message.error('Failed to upload images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    message.info('Image removed');
  };

  const submitVehicleRegistration = async () => {
    try {
      setLoading(true);
      setSubmitMessage(null);
      
      // Ensure authentication for testing
      ensureAuthForTesting();
      
      // Validate required fields
      const requiredFields = [
        { field: 'vehicleType', label: 'Vehicle Type' },
        { field: 'brand', label: 'Brand' },
        { field: 'model', label: 'Model' },
        { field: 'year', label: 'Year' },
        { field: 'licensePlate', label: 'License Plate' },
        { field: 'capacity', label: 'Capacity' },
        { field: 'price', label: 'Price' }
      ];

      for (const { field, label } of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          setSubmitMessage({ type: 'error', text: `${label} is required` });
          setLoading(false);
          return;
        }
      }

      const vehicleData = {
        name: `${formData.brand} ${formData.model}`,
        licensePlate: formData.licensePlate,
        category: formData.vehicleType,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        seatingCapacity: parseInt(formData.capacity),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        features: formData.color ? [`Color: ${formData.color}`] : [],
        images: formData.images, // Real uploaded image URLs
        pricing: {
          pricePerDay: parseFloat(formData.price),
        },
        description: formData.description,
      };

      // Call the backend API
      const response = await vehicleService.createVehicle(vehicleData);
      
      if (response.success) {
        setSubmitMessage({ type: 'success', text: 'Vehicle registered successfully!' });
        message.success('Vehicle registered successfully!');
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            vehicleType: '',
            brand: '',
            model: '',
            year: '',
            licensePlate: '',
            capacity: '',
            fuelType: '',
            transmission: '',
            color: '',
            mileage: '',
            rentalType: 'Per day',
            price: '',
            minimumRental: '',
            description: '',
            images: []
          });
          setCurrentStep(1);
          
          // Navigate to vehicle owner dashboard
          navigate('/vehicle-owner-dashboard');
        }, 2000);
      } else {
        setSubmitMessage({ type: 'error', text: response.message || 'Failed to register vehicle' });
        message.error(response.message || 'Failed to register vehicle');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setSubmitMessage({ type: 'error', text: error?.message || 'Failed to register vehicle' });
      message.error(error?.message || 'Failed to register vehicle');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Register Your Vehicle</h1>
          <p className="mt-2 text-gray-600">
            Join our platform and start earning by renting your vehicle
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 w-16 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Details</span>
            <span>Pricing</span>
            <span>Images</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type *
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select vehicle type</option>
                    <option value="car">Car</option>
                    <option value="suv">SUV</option>
                    <option value="van">Van</option>
                    <option value="bus">Bus</option>
                    <option value="bike">Bike</option>
                    <option value="truck">Truck</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Toyota, Honda"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Camry, Civic"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 30 }, (_, i) => 2024 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Plate *
                  </label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., ABC-1234"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seating Capacity *
                  </label>
                  <select
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select capacity</option>
                    {[1,2,3,4,5,6,7,8,9,10,12,15,20,25,30,40,50].map(num => (
                      <option key={num} value={num}>{num} seats</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type
                  </label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => handleInputChange('fuelType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select fuel type</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmission
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select transmission</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                    <option value="cvt">CVT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., White, Black, Blue"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mileage (km)
                  </label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Current mileage"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Rules */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Pricing & Rules</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Type
                  </label>
                  <select
                    value={formData.rentalType}
                    onChange={(e) => handleInputChange('rentalType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Per day">Per day</option>
                    <option value="Per hour">Per hour</option>
                    <option value="Per km">Per km</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your rental price"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rental Period
                  </label>
                  <input
                    type="text"
                    value={formData.minimumRental}
                    onChange={(e) => handleInputChange('minimumRental', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 1 day, 3 hours"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your vehicle, special features, rules, etc."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Images */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Upload Vehicle Photos</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  
                  <div>
                    <label htmlFor="vehicle-images" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">
                        Click to upload photos
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    <input
                      id="vehicle-images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Upload clear photos of your vehicle. Maximum 5 images allowed.
                    <br />
                    First image will be the main photo.
                  </p>
                </div>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Uploaded Images ({formData.images.length}/5)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => removeImage(index)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Main Photo
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={submitVehicleRegistration}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {loading ? 'Registering...' : 'Register Vehicle'}
              </button>
            )}
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div className={`mt-4 p-4 rounded-lg ${
              submitMessage.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {submitMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterVehicle;
