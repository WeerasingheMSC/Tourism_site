import React, { useState } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Samantha',
    lastName: 'Perera',
    email: 'samantha.perera@email.com',
    phone: '+94 77 123 4567',
    address: '123 Main Street, Colombo 03',
    city: 'Colombo',
    zipCode: '00300',
    businessName: 'SP Vehicle Rentals',
    businessType: 'Individual',
    taxId: 'TAX123456789',
    bankAccount: 'Commercial Bank - ****5678',
    language: 'English',
    notifications: {
      emailBookings: true,
      smsBookings: true,
      emailPromotions: false,
      smsPromotions: false
    }
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('notifications.')) {
      const notificationField = field.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic here
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-x-3">
            <button
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Profile Photo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{profileData.firstName} {profileData.lastName}</h3>
            <p className="text-gray-600">{profileData.businessName}</p>
            {isEditing && (
              <div className="mt-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Change Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.phone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.zipCode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.businessName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
            {isEditing ? (
              <select
                value={profileData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
                <option value="Partnership">Partnership</option>
              </select>
            ) : (
              <p className="text-gray-900">{profileData.businessType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
            {isEditing ? (
              <input
                type="text"
                value={profileData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profileData.taxId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
            <p className="text-gray-900">{profileData.bankAccount}</p>
            {isEditing && (
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1">
                Update Banking Details
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            {isEditing ? (
              <select
                value={profileData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="English">English</option>
                <option value="Sinhala">Sinhala</option>
                <option value="Tamil">Tamil</option>
              </select>
            ) : (
              <p className="text-gray-900">{profileData.language}</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Notification Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profileData.notifications.emailBookings}
                  onChange={(e) => handleInputChange('notifications.emailBookings', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Email notifications for new bookings</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profileData.notifications.smsBookings}
                  onChange={(e) => handleInputChange('notifications.smsBookings', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">SMS notifications for new bookings</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profileData.notifications.emailPromotions}
                  onChange={(e) => handleInputChange('notifications.emailPromotions', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Email promotional offers</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={profileData.notifications.smsPromotions}
                  onChange={(e) => handleInputChange('notifications.smsPromotions', e.target.checked)}
                  disabled={!isEditing}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">SMS promotional offers</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
        <div className="space-y-4">
          <button className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            Change Password
          </button>
          <button className="w-full md:w-auto ml-0 md:ml-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium">
            Enable Two-Factor Authentication
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Deactivate Account</h3>
            <p className="text-sm text-gray-600 mb-3">Temporarily disable your account. You can reactivate it anytime.</p>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 font-medium">
              Deactivate Account
            </button>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
            <p className="text-sm text-gray-600 mb-3">Permanently delete your account and all data. This action cannot be undone.</p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
