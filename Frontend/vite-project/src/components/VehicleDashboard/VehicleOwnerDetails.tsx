import { useState } from 'react';
import VehicleDetailsTab from './VehicleDetailsTab';
import ServiceDetailsTab from './ServiceDetailsTab';

const VehicleOwnerDetails = () => {
  const [activeTab, setActiveTab] = useState('owner-details');
  const [validationError, setValidationError] = useState('');
  
  // State for owner details form data
  const [ownerData, setOwnerData] = useState({
    ownerName: '',
    businessName: '',
    email: '',
    phone: '',
    businessRegistrationNumber: '',
    nicNo: ''
  });

  // State for vehicle details form data
  const [vehicleData, setVehicleData] = useState({
    vehicleType: '',
    brand: '',
    yearOfManufacture: '',
    vehicleNumber: '',
    seatCapacity: '',
    transmissionType: '',
    fuelType: '',
    district: '',
    smallDescription: '',
    features: [] as string[]
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setOwnerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate owner details tab
  const validateOwnerDetails = () => {
    const { ownerName, email, phone, nicNo } = ownerData;
    return ownerName.trim() && email.trim() && phone.trim() && nicNo.trim();
  };

  // Handle navigation
  const handleNext = () => {
    setValidationError('');
    
    if (activeTab === 'owner-details') {
      if (!validateOwnerDetails()) {
        setValidationError('Please fill all required fields (Owner Name, Email, Phone Number, and NIC no) before proceeding');
        return;
      }
      setActiveTab('vehicle-details');
    } else if (activeTab === 'vehicle-details') {
      setActiveTab('service-details');
    }
  };

  const handleBack = () => {
    setValidationError('');
    
    if (activeTab === 'vehicle-details') {
      setActiveTab('owner-details');
    } else if (activeTab === 'service-details') {
      setActiveTab('vehicle-details');
    }
  };

  return (
    <div className="min-h-screen mt-15">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8 bg-white/10 backdrop-blur">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('owner-details')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'owner-details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Owner Details
            </button>
            <button
              onClick={() => setActiveTab('vehicle-details')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'vehicle-details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Vehicle Details
            </button>
            <button
              onClick={() => setActiveTab('service-details')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'service-details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              service details
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Validation Error Message */}
            {validationError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{validationError}</p>
              </div>
            )}

            {activeTab === 'owner-details' && (
              <div className="max-w-4xl">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Vehicle Owner Detail</h2>
                <p className="text-gray-600 mb-6">Enter your information</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder=""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={ownerData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder=""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={ownerData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder=""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={ownerData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder=""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Registration Number
                    </label>
                    <input
                      type="text"
                      value={ownerData.businessRegistrationNumber}
                      onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder=""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIC no <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerData.nicNo}
                      onChange={(e) => handleInputChange('nicNo', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vehicle-details' && (
              <VehicleDetailsTab 
                vehicleData={vehicleData}
                onVehicleDataChange={setVehicleData}
              />
            )}
            {activeTab === 'service-details' && <ServiceDetailsTab />}
          </div>
        </div>

        {/* Navigation Buttons - Outside the form tabs */}
        <div className="flex justify-end items-center gap-3 mt-6">
          <button
            onClick={handleBack}
            disabled={activeTab === 'owner-details'}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'owner-details'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={activeTab === 'service-details'}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'service-details'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleOwnerDetails;
