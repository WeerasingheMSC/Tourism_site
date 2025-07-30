import React, { useState } from 'react';
import FAQFacilitiesTab from './FAQFacilitiesTab';
import HotelDetailsTab from './HotelDetailsTab';
import HotelRulesTab from './HotelRulesTab';

const HotelOwnerDetails = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // State for profile form data
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: 'English',
    profilePicture: null as File | null
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setProfileData(prev => ({
      ...prev,
      profilePicture: file
    }));
  };

  return (
    <div className="min-h-screen mt-15">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8 bg-white/10 backdrop-blur">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('hotel-details')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'hotel-details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Hotel Details
            </button>
            <button
              onClick={() => setActiveTab('hotel-rules')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'hotel-rules'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Hotel Rules
            </button>
            <button
              onClick={() => setActiveTab('faq-facilities')}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === 'faq-facilities'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              FAQ & Facilities
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="max-w-3xl">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Hotel Owner Detail</h2>
                <p className="text-gray-600 mb-6">Enter your information</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder=""
                    />
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder=""
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder=""
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder=""
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select 
                        required
                        value={profileData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>English</option>
                        <option>Sinhala</option>
                        <option>Tamil</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Hotel Owner Profile Picture
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                          id="owner-profile-picture"
                        />
                        <label htmlFor="owner-profile-picture" className="cursor-pointer block w-full">
                          <div className="text-center">
                            <div className="mx-auto w-12 h-12 text-gray-400 mb-4 flex items-center justify-center">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 font-medium">Click to upload profile picture</p>
                            <p className="text-xs text-gray-500">Or drag and drop files</p>
                          </div>
                        </label>
                      </div>

                      

                      {/* Display uploaded file */}
                      {profileData.profilePicture && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Profile Picture:</h4>
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                            <div className="flex items-center gap-3">
                              <img 
                                src={URL.createObjectURL(profileData.profilePicture)} 
                                alt="Profile Preview" 
                                className="w-12 h-12 object-cover rounded-full"
                              />
                              <span className="text-sm text-gray-700">{profileData.profilePicture.name}</span>
                            </div>
                            <button
                              onClick={() => setProfileData(prev => ({ ...prev, profilePicture: null }))}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-8">
                    <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium">
                      Next
                    </button>
                  </div>
                </div>
              )}
            
            {activeTab === 'hotel-details' && <HotelDetailsTab />}
            {activeTab === 'hotel-rules' && <HotelRulesTab />}
            {activeTab === 'faq-facilities' && <FAQFacilitiesTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelOwnerDetails;