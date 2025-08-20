import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { vehicleOwnerService } from '../../api/vehicleOwner';
import { isAuthenticated } from '../../utils/authHelper';

const VehicleOwnerDetails = () => {
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for owner details form data only
  const [ownerData, setOwnerData] = useState({
    ownerName: '',
    businessName: '',
    email: '',
    phone: '',
    businessRegistrationNumber: '',
    nicNo: ''
  });

  // Load existing profile data on component mount
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!isAuthenticated()) {
        return;
      }

      try {
        const profile = await vehicleOwnerService.getProfile();
        if (profile) {
          setOwnerData({
            ownerName: profile.ownerName || '',
            businessName: profile.businessName || '',
            email: profile.email || '',
            phone: profile.phone || '',
            businessRegistrationNumber: profile.businessRegistrationNumber || '',
            nicNo: profile.nicNo || ''
          });
        }
      } catch (error) {
        // Profile doesn't exist yet, which is fine for new users
        console.log('No existing profile found');
      }
    };

    loadExistingProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setOwnerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate owner details form
  const validateOwnerDetails = () => {
    const { ownerName, businessName, email, phone, businessRegistrationNumber, nicNo } = ownerData;
    
    if (!ownerName || !businessName || !email || !phone || !businessRegistrationNumber || !nicNo) {
      setValidationError('All fields are required.');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    
    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setValidationError('Please enter a valid 10-digit phone number.');
      return false;
    }
    
    // NIC validation (basic)
    if (nicNo.length < 9) {
      setValidationError('Please enter a valid NIC number.');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  // Handle form submission
  const handleSaveOwnerDetails = async () => {
    if (!validateOwnerDetails()) {
      return;
    }

    if (!isAuthenticated()) {
      message.error('Please login to continue');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        ownerName: ownerData.ownerName,
        businessName: ownerData.businessName,
        email: ownerData.email,
        phone: ownerData.phone,
        businessRegistrationNumber: ownerData.businessRegistrationNumber,
        nicNo: ownerData.nicNo,
        isProfileCompleted: true,
        profileStep: 'completed'
      };

      await vehicleOwnerService.createOrUpdateProfile(profileData);
      message.success('Owner profile saved successfully!');
      navigate('/vehicle-owner-dashboard');
    } catch (error: any) {
      console.error('Error saving owner details:', error);
      message.error(error.response?.data?.message || 'Failed to save owner details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-15">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="rounded-xl shadow-sm mb-8 bg-white/10 backdrop-blur">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-blue-600">Vehicle Owner Profile</h2>
            <p className="text-gray-600 text-sm mt-1">Please complete your owner information to access the dashboard</p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {/* Validation Error Message */}
            {validationError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{validationError}</p>
              </div>
            )}

            {/* Owner Details Form - Only owner information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
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
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your business name"
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
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="space-y-4">
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
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerData.businessRegistrationNumber}
                    onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter business registration number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIC Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerData.nicNo}
                    onChange={(e) => handleInputChange('nicNo', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your NIC number"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveOwnerDetails}
            disabled={loading}
            className="px-8 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Owner Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleOwnerDetails;
