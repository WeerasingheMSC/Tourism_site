import React from "react";

export interface HotelOwnerDetailsProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    language: string;
    profilePicture: File | null;
  };
  setProfileData: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    language: string;
    profilePicture: File | null;
  }>>;
}

const HotelOwnerDetails: React.FC<HotelOwnerDetailsProps> = ({
  profileData,
  setProfileData,
}) => {
  const handleInputChange = (
    field: keyof typeof profileData,
    value: string
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;
    setProfileData((prev) => ({ ...prev, profilePicture: file }));
  };

  return (
    <div className="max-w-4xl ">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Hotel Owner Details
      </h2>
      <p className="text-gray-600 mb-6">Enter your information</p>

      <div className="grid grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            required
            value={profileData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            required
            value={profileData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            required
            value={profileData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={profileData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Language */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            required
            value={profileData.language}
            onChange={(e) => handleInputChange("language", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>English</option>
            <option>Sinhala</option>
            <option>Tamil</option>
          </select>
        </div>

        {/* Profile Picture */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Profile Picture
          </label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
              id="owner-profile-picture"
            />
            <label
              htmlFor="owner-profile-picture"
              className="cursor-pointer block w-full"
            >
              <p className="text-gray-500">Click to select a file</p>
            </label>
          </div>

          {profileData.profilePicture && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded">
              <div className="flex items-center gap-3">
                <img
                  src={URL.createObjectURL(profileData.profilePicture)}
                  alt="Preview"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span>{profileData.profilePicture.name}</span>
              </div>
              <button
                onClick={() =>
                  setProfileData((prev) => ({ ...prev, profilePicture: null }))
                }
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelOwnerDetails;
