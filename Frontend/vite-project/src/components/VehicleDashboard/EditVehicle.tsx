import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehicleService } from '../../api/vehicleBookings';
import { ensureAuthForTesting } from '../../utils/authHelper';
import { uploadFileAndGetURL } from '../../firebase';
import { message, Button } from 'antd';
import type { Vehicle } from '../../api/vehicleBookings';

const EditVehicle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    vehicleType: '',
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    // Vehicle Details
    seatingCapacity: '',
    fuelType: '',
    transmission: '',
    color: '',
    mileage: '',
    airConditioning: false,
    // Location Information
    location: {
      city: '',
      area: '',
      address: '',
      coordinates: [0, 0] as [number, number]
    },
    // Pricing & Description
    pricing: {
      pricePerDay: ''
    },
    description: '',
    // FAQs
    faqs: [{ question: '', answer: '' }],
    // Features & Images
    features: [] as string[],
    images: [] as string[]
  });

  useEffect(() => {
    if (id) {
      loadVehicle();
    }
  }, [id]);

  const loadVehicle = async () => {
    try {
      ensureAuthForTesting();
      setLoadingVehicle(true);
      
      const response = await vehicleService.getVehicleById(id!);
      const vehicleData = response.data;
      setVehicle(vehicleData);
      
      // Enhanced auto-population with better field mapping
      setFormData({
        name: vehicleData.title || vehicleData.name || `${vehicleData.make || vehicleData.brand || ''} ${vehicleData.model || ''}`.trim() || '',
        vehicleType: vehicleData.vehicleType || vehicleData.category || '',
        brand: vehicleData.brand || vehicleData.make || '',
        model: vehicleData.model || '',
        year: (vehicleData.year || '').toString(),
        licensePlate: vehicleData.licensePlate || vehicleData.registrationNumber || '',
        seatingCapacity: (vehicleData.seatingCapacity || vehicleData.seatCapacity || '').toString(),
        fuelType: vehicleData.fuelType || '',
        transmission: vehicleData.transmission || '',
        color: vehicleData.color || '',
        mileage: (vehicleData.mileage || '').toString(),
        airConditioning: vehicleData.airConditioning || vehicleData.features?.includes('Air Conditioning') || vehicleData.features?.includes('AC') || false,
        location: {
          city: vehicleData.location?.city || '',
          area: vehicleData.location?.area || '',
          address: vehicleData.location?.address || '',
          coordinates: vehicleData.location?.coordinates || [0, 0]
        },
        pricing: {
          pricePerDay: (vehicleData.price?.perDay || vehicleData.pricing?.pricePerDay || '').toString()
        },
        description: vehicleData.description || '',
        faqs: vehicleData.faqs && vehicleData.faqs.length > 0 ? vehicleData.faqs : [{ question: '', answer: '' }],
        features: vehicleData.features || [],
        images: vehicleData.images || []
      });
      
      console.log('🔧 EditVehicle Debug - Loaded vehicle data:', vehicleData);
      console.log('🔧 EditVehicle Debug - Populated form data:', {
        name: vehicleData.title || vehicleData.name || `${vehicleData.make || vehicleData.brand || ''} ${vehicleData.model || ''}`.trim(),
        vehicleType: vehicleData.vehicleType || vehicleData.category,
        brand: vehicleData.brand || vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        licensePlate: vehicleData.licensePlate || vehicleData.registrationNumber,
        seatingCapacity: vehicleData.seatingCapacity || vehicleData.seatCapacity,
        fuelType: vehicleData.fuelType,
        transmission: vehicleData.transmission,
        color: vehicleData.color,
        mileage: vehicleData.mileage,
        airConditioning: vehicleData.airConditioning,
        location: vehicleData.location,
        faqs: vehicleData.faqs,
        features: vehicleData.features,
        pricing: vehicleData.price || vehicleData.pricing,
        description: vehicleData.description
      });
      
    } catch (error: any) {
      console.error('Error loading vehicle:', error);
      message.error('Failed to load vehicle details');
      navigate('/transport-owner-dashboard');
    } finally {
      setLoadingVehicle(false);
    }
  };

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
    if (formData.faqs.length > 1) {
      setFormData(prev => ({
        ...prev,
        faqs: prev.faqs.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter(f => f !== feature)
      }));
    }
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

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const validateStep = (step: number): boolean => {
    // Function for future step validation if needed
    switch (step) {
      case 1:
        return !!(formData.name && formData.vehicleType && formData.brand && formData.model && formData.year && formData.licensePlate);
      case 2:
        return !!(formData.seatingCapacity && formData.fuelType && formData.transmission);
      case 3:
        return !!(formData.location.city && formData.location.area);
      case 4:
        return true; // FAQs are optional but we want at least basic ones
      case 5:
        return !!(formData.pricing.pricePerDay && formData.description);
      case 6:
        return true; // Final step
      default:
        return false;
    }
  };

  const updateVehicle = async () => {
    try {
      setLoading(true);
      ensureAuthForTesting();
      
      // Validate required fields
      const requiredFields = [
        { field: 'name', label: 'Vehicle Name' },
        { field: 'vehicleType', label: 'Vehicle Type' },
        { field: 'brand', label: 'Brand' },
        { field: 'model', label: 'Model' },
        { field: 'year', label: 'Year' },
        { field: 'licensePlate', label: 'License Plate' },
        { field: 'seatingCapacity', label: 'Seating Capacity' },
        { field: 'pricing.pricePerDay', label: 'Price per Day' }
      ];

      for (const { field, label } of requiredFields) {
        const value = field.includes('.') 
          ? formData.pricing.pricePerDay 
          : formData[field as keyof typeof formData];
        if (!value) {
          message.error(`${label} is required`);
          setLoading(false);
          return;
        }
      }

      // Prepare data for backend (matching the backend controller expectations)
      const vehicleData = {
        name: formData.name,
        description: formData.description,
        category: formData.vehicleType,
        vehicleType: formData.vehicleType,
        brand: formData.brand,
        make: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        licensePlate: formData.licensePlate,
        registrationNumber: formData.licensePlate,
        seatingCapacity: parseInt(formData.seatingCapacity),
        seatCapacity: parseInt(formData.seatingCapacity),
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
        features: formData.features,
        images: formData.images,
        pricing: {
          pricePerDay: parseFloat(formData.pricing.pricePerDay),
        },
        price: {
          perDay: parseFloat(formData.pricing.pricePerDay),
        },
        faqs: formData.faqs.filter(faq => faq.question && faq.answer),
        available: true
      };

      const response = await vehicleService.updateVehicle(id!, vehicleData);
      
      if (response.success !== false) {
        message.success('Vehicle updated successfully!');
        navigate('/transport-owner-dashboard');
      } else {
        message.error(response.message || 'Failed to update vehicle');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      message.error(error?.message || 'Failed to update vehicle');
    } finally {
      setLoading(false);
    }
  };

  if (loadingVehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Vehicle not found</p>
          <Button onClick={() => navigate('/transport-owner-dashboard')}>
            Go Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Vehicle</h1>
            <p className="text-gray-600">Update your vehicle information</p>
          </div>
          <button
            onClick={() => navigate('/transport-owner-dashboard')}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>
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
      <div className="rounded-lg shadow-sm border border-gray-200 p-6 bg-transparent backdrop-blur">
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
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                >
                  <option value="">Select vehicle type</option>
                  <option value="Car">Car</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                  <option value="Bus">Bus</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Truck">Truck</option>
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

              <div>
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
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="CNG">CNG</option>
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
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="CVT">CVT</option>
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
                  'Parking Sensors'
                ].map((feature) => (
                  <label key={feature} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={(e) => handleFeatureChange(feature, e.target.checked)}
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
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
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
                  onChange={(e) => handleInputChange('location.area', e.target.value)}
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
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
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
            <h2 className="text-xl font-semibold text-gray-900">Pricing & Vehicle Description</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Day ($) *
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
            
            {/* Current Images */}
            {formData.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Images ({formData.images.length}/5)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            {formData.images.length < 5 && (
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
                    disabled={formData.images.length >= 5 || loading}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload clear photos of your vehicle. First image will be the main photo.
                    <br />
                    Remaining slots: {5 - formData.images.length}
                  </p>
                </div>
              </div>
            )}

            {/* Review Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Vehicle:</strong> {formData.brand} {formData.model} ({formData.year})</div>
                <div><strong>Type:</strong> {formData.vehicleType}</div>
                <div><strong>License Plate:</strong> {formData.licensePlate}</div>
                <div><strong>Capacity:</strong> {formData.seatingCapacity} passengers</div>
                <div><strong>Fuel Type:</strong> {formData.fuelType}</div>
                <div><strong>Transmission:</strong> {formData.transmission}</div>
                <div><strong>Location:</strong> {formData.location.city}, {formData.location.area}</div>
                <div><strong>Features:</strong> {formData.features.length} selected</div>
                <div><strong>FAQs:</strong> {formData.faqs.filter(faq => faq.question && faq.answer).length} added</div>
                <div><strong>Price:</strong> $ {formData.pricing.pricePerDay}</div>
                <div><strong>Air Conditioning:</strong> {formData.airConditioning ? 'Yes' : 'No'}</div>
                <div><strong>Images:</strong> {formData.images.length} uploaded</div>
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
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={updateVehicle}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              {loading ? 'Updating...' : 'Update Vehicle'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditVehicle;
