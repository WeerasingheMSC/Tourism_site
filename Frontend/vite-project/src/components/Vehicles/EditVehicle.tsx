import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Car, Save, X, Plus, Trash2, Upload, MapPin } from 'lucide-react';
import { vehicleService } from '../../api/vehicleBookings';
import { ensureAuthForTesting } from '../../utils/authHelper';
import { uploadFileAndGetURL } from '../../firebase';
import { message } from 'antd';
import type { Vehicle } from '../../api/vehicleBookings';

// Import images from assets
import beach2 from '../../assets/beach2.jpg';
import beach4 from '../../assets/beach4.jpg';
import beach5 from '../../assets/beach5.jpg';

const EditVehicle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  
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
    // Update selected image if it was removed
    if (selectedImage >= formData.images.length - 1) {
      setSelectedImage(Math.max(0, formData.images.length - 2));
    }
    message.info('Image removed');
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

      // Prepare data for backend
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

  // Helper function to get vehicle name
  const getVehicleName = () => {
    return formData.name || `${formData.brand} ${formData.model}`.trim() || 'Vehicle';
  };

  // Helper function to get vehicle images or use fallbacks
  const getVehicleImages = () => {
    if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
      return formData.images;
    }
    // Return fallback images only if no real images exist
    const fallbackImages = [
      '/beach2.jpg',           
      '/beach3.jpg',           
      '/Sri-Lanka-tourism.jpg', 
      beach4,                  
      beach5,                  
      beach2                   
    ];
    return fallbackImages;
  };

  // Loading state
  if (loadingVehicle) {
    return (
      <div className="min-h-screen mt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!vehicle) {
    return (
      <div className="min-h-screen mt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Vehicle not found</p>
          <button 
            onClick={() => navigate('/transport-owner-dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const vehicleImages = getVehicleImages();

  return (
    <div className="min-h-screen mt-16 lg:mt-20 z-10">
      {/* Breadcrumb */}
      <div className="border-b border-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/transport-owner-dashboard')}>
              Transport Owner Dashboard
            </span>
            <span className="mx-2 text-gray-500">{'>'}</span>
            <span className="hover:text-blue-600 cursor-pointer truncate">Edit Vehicle</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Header and Sidebar Container */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mb-6 lg:mb-8">
          {/* Main Content - Left Side */}
          <div className="flex-1 order-2 lg:order-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm mb-4 lg:mb-6">
              <div className="p-4 lg:p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Car className="w-6 h-6 text-blue-600" />
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Edit Vehicle</h1>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate('/transport-owner-dashboard')}
                        className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={updateVehicle}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Updating...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Editable Vehicle Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-xl lg:text-2xl font-bold text-gray-900 w-full border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-transparent"
                      placeholder="Enter vehicle name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Toyota, Honda, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Camry, Civic, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                      <select
                        value={formData.vehicleType}
                        onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2023"
                        min="1980"
                        max="2025"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                      <input
                        type="text"
                        value={formData.licensePlate}
                        onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ABC-1234"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                {/* Mobile: Single image carousel */}
                <div className="block lg:hidden">
                  <div className="relative">
                    <img 
                      src={vehicleImages[selectedImage]} 
                      alt={getVehicleName()}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {/* Image counter */}
                    <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                      {selectedImage + 1} / {vehicleImages.length}
                    </div>
                    {/* Navigation arrows */}
                    <button 
                      onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : vehicleImages.length - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"
                    >
                      ←
                    </button>
                    <button 
                      onClick={() => setSelectedImage(selectedImage < vehicleImages.length - 1 ? selectedImage + 1 : 0)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full"
                    >
                      →
                    </button>
                    {/* Remove image button */}
                    {formData.images.length > 0 && (
                      <button
                        onClick={() => removeImage(selectedImage)}
                        className="absolute top-3 left-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {/* Thumbnail strip */}
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {vehicleImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`View ${index + 1}`}
                        className={`w-16 h-12 object-cover rounded cursor-pointer flex-shrink-0 ${
                          selectedImage === index ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedImage(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Desktop: Grid layout */}
                <div className="hidden lg:block">
                  {/* Top row with main image and right column */}
                  <div className="flex gap-3 mb-3">
                    {/* Main large image */}
                    <div className="relative group cursor-pointer overflow-hidden rounded-lg">
                      <img 
                        src={vehicleImages[selectedImage]} 
                        alt={getVehicleName()}
                        className="w-[560px] h-[375px] object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Remove image button */}
                      {formData.images.length > 0 && (
                        <button
                          onClick={() => removeImage(selectedImage)}
                          className="absolute top-3 left-3 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Right column - 3 vertical images */}
                    <div className="flex flex-col gap-3">
                      {[1, 2, 3].map((index) => (
                        <div 
                          key={index}
                          className="relative group cursor-pointer overflow-hidden rounded-lg"
                          onClick={() => setSelectedImage(index)}
                        >
                          <img 
                            src={vehicleImages[index] || vehicleImages[0]} 
                            alt={`${getVehicleName()} view ${index}`}
                            className={`w-[180px] h-[120px] object-cover transition-all duration-300 group-hover:scale-105 ${
                              selectedImage === index ? 'ring-2 ring-blue-500' : ''
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bottom row - 4 horizontal images */}
                  <div className="flex gap-3">
                    {[0, 4, 5, 1].map((index, i) => (
                      <div 
                        key={i}
                        className="relative group cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => setSelectedImage(index)}
                      >
                        <img 
                          src={vehicleImages[index] || vehicleImages[0]} 
                          alt={`${getVehicleName()} view ${index}`}
                          className={`w-[180px] h-[120px] object-cover transition-all duration-300 group-hover:scale-105 ${
                            selectedImage === index ? 'ring-2 ring-blue-500' : ''
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload New Images */}
                {formData.images.length < 5 && (
                  <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload vehicle images (Maximum 5 images)</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={loading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                      } transition-colors`}
                    >
                      {loading ? 'Uploading...' : 'Select Images'}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Remaining slots: {5 - formData.images.length}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 flex flex-col order-1 lg:order-2">
            {/* Vehicle Specifications */}
            <div className="relative rounded-xl overflow-hidden mb-4 lg:mb-6 border border-black/10 bg-white">
              <div className="p-4 lg:p-6">
                <h2 className="text-lg font-semibold mb-4">Vehicle Specifications</h2>
                
                {/* Vehicle Details Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Seats</label>
                      <input
                        type="number"
                        value={formData.seatingCapacity}
                        onChange={(e) => handleInputChange('seatingCapacity', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="4"
                        min="1"
                        max="50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Fuel Type</label>
                      <select
                        value={formData.fuelType}
                        onChange={(e) => handleInputChange('fuelType', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                        <option value="CNG">CNG</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Transmission</label>
                      <select
                        value={formData.transmission}
                        onChange={(e) => handleInputChange('transmission', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                        <option value="CVT">CVT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        placeholder="White, Black..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Mileage (km)</label>
                    <input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => handleInputChange('mileage', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50000"
                      min="0"
                    />
                  </div>

                  {/* Air Conditioning */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.airConditioning}
                        onChange={(e) => handleInputChange('airConditioning', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Air Conditioning</span>
                    </label>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day (Dollar)</label>
                  <input
                    type="number"
                    value={formData.pricing.pricePerDay}
                    onChange={(e) => handleInputChange('pricing.pricePerDay', e.target.value)}
                    className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5000"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Features Selection */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <div className="grid grid-cols-1 gap-2">
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
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Content Section */}
        <div className="max-w-7xl mx-auto">
          {/* Description Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Description About Vehicle</h2>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Describe your vehicle, its condition, and any special features or terms..."
              rows={5}
            />
          </div>

          {/* Vehicle Location */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Vehicle Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Colombo, Kandy, Galle..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <input
                  type="text"
                  value={formData.location.area}
                  onChange={(e) => handleInputChange('location.area', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Mount Lavinia, Peradeniya..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                <textarea
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter full address where vehicle can be picked up"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* FAQs About Vehicle */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">FAQs About Vehicle</h2>
            <div className="space-y-4">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">FAQ {index + 1}</h3>
                    {formData.faqs.length > 1 && (
                      <button
                        onClick={() => removeFAQ(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="What is included in the rental?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="The rental includes fuel, insurance, and 24/7 roadside assistance."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addFAQ}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Another FAQ
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-end space-x-4">
            <button
              onClick={() => navigate('/transport-owner-dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={updateVehicle}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Add padding to prevent content from being hidden behind fixed buttons */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default EditVehicle;
