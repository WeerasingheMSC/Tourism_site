import React, { useRef } from 'react';

interface PackageDetailsTabProps {
  formData: {
    name: string;
    theme: string;
    description: string;
    idealFor: string[];
    startingPrice: string;
    packageIcon: File | null;
    packagePhotos: File[];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  idealForOptions: string[];
}

const PackageDetailsTab: React.FC<PackageDetailsTabProps> = ({
  formData,
  setFormData,
  idealForOptions,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (option: string) => {
    setFormData((prev: any) => ({
      ...prev,
      idealFor: prev.idealFor.includes(option)
        ? prev.idealFor.filter((item: string) => item !== option)
        : [...prev.idealFor, option],
    }));
  };

  const handleFileUpload = (files: FileList | null, type: 'icon' | 'photos') => {
    if (!files) return;

    if (type === 'icon') {
      const file = files[0];
      if (file && file.type !== 'image/png') {
        alert('Package icon must be a PNG image.');
        return;
      }
      setFormData((prev: any) => ({
        ...prev,
        packageIcon: file,
      }));
    } else {
      // Accept any raster image type for photos
      const validFiles = Array.from(files).filter(file =>
        file.type.startsWith('image/')
      );
      setFormData((prev: any) => ({
        ...prev,
        packagePhotos: [...prev.packagePhotos, ...validFiles],
      }));
    }
  };

  // Add refs for file inputs
  const iconInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-8 ">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Package details</h2>
        <p className="text-gray-600 text-sm">Enter your package information</p>
      </div>

      <div className="space-y-6">
        {/* Name and Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name of the package
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <input
              type="text"
              name="theme"
              value={formData.theme}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Small description ( up to 30 words )
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Ideal For Checkboxes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Ideal for (select up to 4)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {idealForOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.idealFor.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  // required is not needed for checkboxes in a group, validation is handled in parent
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Starting Price */}
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Starting price (USD)
          </label>
          <input
            type="text"
            name="startingPrice"
            value={formData.startingPrice}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Upload Package Icon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            upload package icon
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/png"
              onChange={(e) => handleFileUpload(e.target.files, 'icon')}
              className="hidden"
              id="package-icon"
              ref={iconInputRef}
              required
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors mb-2"
              onClick={() => iconInputRef.current?.click()}
            >
              Add File
            </button>
            <p className="text-sm text-gray-500">upload png image with 100 × 100 pixels</p>
            {formData.packageIcon && (
              <span className="block mt-2 text-green-600 text-xs">
                {formData.packageIcon.name}
              </span>
            )}
          </div>
        </div>

        {/* Upload Package Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            upload package related photos
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e.target.files, 'photos')}
              className="hidden"
              id="package-photos"
              ref={photosInputRef}
              required
            />
            <button
              type="button"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors mb-2"
              onClick={() => photosInputRef.current?.click()}
            >
              Add File
            </button>
            <p className="text-sm text-gray-500">Or drag and drop files ( up to 30 photos )</p>
            {formData.packagePhotos.length > 0 && (
              <span className="block mt-2 text-green-600 text-xs">
                {formData.packagePhotos.map((file: File) => file.name).join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsTab;