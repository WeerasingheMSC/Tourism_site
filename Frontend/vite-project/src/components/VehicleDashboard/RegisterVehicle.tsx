import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { vehicleService } from '../../api/vehicleBookings';
import { getCurrentVehicleOwner, isAuthenticated } from '../../utils/authHelper';
import { uploadFileAndGetURL } from '../../firebase';

const RegisterVehicle = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info (Step 1)
    name: '',
    category: '',
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    // Details (Step 2)
    seatingCapacity: '',
    fuelType: '',
    transmission: '',
    color: '',
    mileage: '',
    airConditioning: false,
    // Location (Step 3)
    location: {
      city: '',
      area: '',
      address: '',
      coordinates: [0, 0] as [number, number] // [longitude, latitude]
    },
    // Pricing & Details (Step 5)
    pricing: {
      pricePerDay: ''
    },
    description: '',
    rentalType: 'Per day',
    minimumRental: '',
    // FAQs (Step 4)
    faqs: [
      { question: 'What is included in the rental?', answer: '' },
      { question: 'What are the pickup and return times?', answer: '' },
      { question: 'Is fuel included?', answer: '' }
    ],
    // Features & Images (Step 6)
    features: [] as string[],
    images: [] as File[]
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleLocationChange = (field: string, value: string | number[]) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleFAQChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFAQs = [...formData.faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setFormData(prev => ({ ...prev, faqs: newFAQs }));
  };

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFAQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5)
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Check authentication
    if (!isAuthenticated()) {
      message.error('Please log in as a vehicle owner to register a vehicle');
      navigate('/login');
      return;
    }

    const owner = getCurrentVehicleOwner();
    if (!owner) {
      message.error('Unable to get user information. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // Upload images to Firebase first
      let imageUrls: string[] = [];
      if (formData.images.length > 0) {
        console.log('🖼️ Uploading', formData.images.length, 'images to Firebase...');
        
        try {
          const uploadPromises = formData.images.map(file => 
            uploadFileAndGetURL(file, "vehicleImages")
          );
          imageUrls = await Promise.all(uploadPromises);
          console.log('✅ Images uploaded successfully:', imageUrls);
          message.success(`Successfully uploaded ${imageUrls.length} image(s)!`);
        } catch (uploadError) {
          console.error('❌ Image upload failed:', uploadError);
          message.error('Failed to upload images. Please try again.');
          setLoading(false);
          return;
        }
      }

      // Prepare vehicle data for backend (matching backend controller expectations)
      const vehicleData = {
        name: formData.name, // Backend maps this to 'title'
        description: formData.description,
        category: formData.category, // Backend maps this to 'vehicleType'
        brand: formData.brand, // Backend maps this to 'make'
        model: formData.model,
        year: parseInt(formData.year),
        licensePlate: formData.licensePlate, // Backend maps this to 'registrationNumber'
        seatingCapacity: parseInt(formData.seatingCapacity), // Backend maps this to 'seatCapacity'
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        color: formData.color,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        airConditioning: formData.airConditioning,
        location: {
          city: formData.location.city,
          area: formData.location.area,
          address: formData.location.address,
          coordinates: formData.location.coordinates
        },
        pricing: {
          pricePerDay: parseFloat(formData.pricing.pricePerDay),
          pricePerHour: undefined // Optional field for backend
        },
        features: formData.features,
        images: imageUrls, // Now contains Firebase URLs
        faqs: formData.faqs.filter(faq => faq.question && faq.answer),
        available: true
        // Note: ownerId will be set automatically by backend from JWT token
      };

      console.log('🚗 Registering vehicle with data:', vehicleData);

      // Submit to backend
      const response = await vehicleService.createVehicle(vehicleData);
      
      console.log('✅ Vehicle registration response:', response);
      message.success('Vehicle registered successfully!');
      
      // Redirect to vehicle dashboard
      navigate('/transport-owner-dashboard');
      
    } catch (error: any) {
      console.error('❌ Vehicle registration error:', error);
      
      if (error?.message?.includes('403') || error?.message?.includes('Access denied')) {
        message.error('Access denied. Please ensure you are logged in as a vehicle owner.');
        navigate('/login');
      } else if (error?.errors && Array.isArray(error.errors)) {
        // Handle validation errors
        const errorMessages = error.errors.map((err: any) => err.msg).join(', ');
        message.error(`Validation errors: ${errorMessages}`);
      } else {
        message.error(error?.message || 'Failed to register vehicle. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Vehicle Details' },
    { number: 3, title: 'Location' },
    { number: 4, title: 'FAQs' },
    { number: 5, title: 'Pricing & Rules' },
    { number: 6, title: 'Photos & Review' }
  ];

  return (
    <div className="max-w-4xl mx-auto mt-32 mb-32">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Register New Vehicle</h1>
        <p className="text-gray-600">Add a new vehicle to your rental fleet</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step.number}
              </div>
              <span className="mt-2 text-xs text-gray-500">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Content */}
      <div className= " rounded-lg shadow-sm border border-gray-200 p-6 bg-transparent backdrop-blur">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Basic Vehicle Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Name *
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="e.g., Toyota Camry 2020"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type *
                </label>
                                <select
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="">Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="van">Van</option>
                  <option value="bus">Bus</option>
                  <option value="suv">SUV</option>
                  <option value="motorcycle">Motorcycle</option>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Corolla, Civic"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 2020"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Plate Number *
                </label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seating Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.seatingCapacity}
                  onChange={(e) => handleInputChange('seatingCapacity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Number of passengers"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type *
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select fuel type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                  <option value="cng">CNG</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission *
                </label>
                <select
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., White, Black"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Mileage (km)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Current odometer reading"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.airConditioning}
                    onChange={(e) => handleInputChange('airConditioning', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Air Conditioning Available</span>
                </label>
              </div>
            </div>

            {/* Vehicle Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'GPS Navigation',
                  'Bluetooth',
                  'USB Charging',
                  'WiFi Hotspot',
                  'Leather Seats',
                  'Sunroof',
                  'Backup Camera',
                  'Parking Sensors',
                  'Cruise Control',
                  'Heated Seats'
                ].map((feature) => (
                  <label key={feature} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, features: [...prev.features, feature] }));
                        } else {
                          setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== feature) }));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Location</h2>
            <p className="text-gray-600">Provide the location where customers can pick up the vehicle</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Colombo, Kandy, Galle"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area *
                </label>
                <input
                  type="text"
                  value={formData.location.area}
                  onChange={(e) => handleLocationChange('area', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mount Lavinia, Peradeniya"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Address
                </label>
                <textarea
                  value={formData.location.address}
                  onChange={(e) => handleLocationChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the detailed address where customers can pick up the vehicle"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: FAQs */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600">Add common questions and answers about your vehicle to help customers</p>
            
            <div className="space-y-4">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question {index + 1}
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., What is included in the rental?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., The rental includes fuel, insurance, and 24/7 roadside assistance."
                      />
                    </div>
                    {formData.faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFAQ(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove FAQ
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addFAQ}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another FAQ
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Pricing & Rules */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Pricing & Rental Rules</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rental Type *
                </label>
                <select
                  value={formData.rentalType}
                  onChange={(e) => handleInputChange('rentalType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Per hour">Per hour</option>
                  <option value="Per day">Per day</option>
                  <option value="Per week">Per week</option>
                  <option value="Per month">Per month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (Rs.) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricing.pricePerDay}
                  onChange={(e) => handleInputChange('pricing.pricePerDay', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rental Period
                </label>
                <input
                  type="text"
                  value={formData.minimumRental}
                  onChange={(e) => handleInputChange('minimumRental', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 1 day, 4 hours"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your vehicle, its features, condition, and any rental terms..."
                required
              />
            </div>
          </div>
        )}

        {/* Step 6: Photos & Review */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Photos & Review</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Vehicle Photos (Maximum 5)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                  disabled={formData.images.length >= 5}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload clear photos of your vehicle. First image will be the main photo.
                </p>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-5 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Vehicle ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Review Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Vehicle:</strong> {formData.brand} {formData.model} ({formData.year})</div>
                <div><strong>Type:</strong> {formData.category}</div>
                <div><strong>License Plate:</strong> {formData.licensePlate}</div>
                <div><strong>Capacity:</strong> {formData.seatingCapacity} passengers</div>
                <div><strong>Fuel Type:</strong> {formData.fuelType}</div>
                <div><strong>Transmission:</strong> {formData.transmission}</div>
                <div><strong>Location:</strong> {formData.location.city}, {formData.location.area}</div>
                <div><strong>Features:</strong> {formData.features.length} selected</div>
                <div><strong>FAQs:</strong> {formData.faqs.filter(faq => faq.question && faq.answer).length} added</div>
                <div><strong>Rental Type:</strong> {formData.rentalType}</div>
                <div><strong>Price:</strong> {formData.pricing.pricePerDay} $</div>
                <div><strong>Air Conditioning:</strong> {formData.airConditioning ? 'Yes' : 'No'}</div>
              </div>
              {formData.location.address && (
                <div className="mt-4">
                  <strong>Pickup Address:</strong> {formData.location.address}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {currentStep < 6 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register Vehicle'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterVehicle;
