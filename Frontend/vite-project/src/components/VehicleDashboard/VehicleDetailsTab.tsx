import { useState } from 'react';

interface VehicleDetails {
  vehicleType: string;
  brand: string;
  yearOfManufacture: string;
  vehicleNumber: string;
  seatCapacity: string;
  transmissionType: string;
  fuelType: string;
  district: string;
  smallDescription: string;
  features: string[];
}

interface VehicleDetailsTabProps {
  vehicleData: VehicleDetails;
  onVehicleDataChange: (data: VehicleDetails) => void;
}

const VehicleDetailsTab = ({ vehicleData, onVehicleDataChange }: VehicleDetailsTabProps) => {
  const handleInputChange = (field: keyof VehicleDetails, value: string) => {
    onVehicleDataChange({ ...vehicleData, [field]: value });
  };

  const handleFeatureToggle = (feature: string) => {
    const updatedFeatures = vehicleData.features.includes(feature)
      ? vehicleData.features.filter(f => f !== feature)
      : [...vehicleData.features, feature];
    
    onVehicleDataChange({ ...vehicleData, features: updatedFeatures });
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Vehicle Detail</h2>
      <p className="text-gray-600 mb-6">Enter your Vehicle information</p>
      
      <div className="space-y-6">
        {/* Row 1: Vehicle Type and Brand */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type <span className="text-red-500">**</span>
            </label>
            <select
              required
              value={vehicleData.vehicleType}
              onChange={(e) => handleInputChange('vehicleType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Car</option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
              <option value="SUV">SUV</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand <span className="text-red-500">**</span>
            </label>
            <input
              type="text"
              required
              value={vehicleData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Car"
            />
          </div>
        </div>

        {/* Row 2: Year of manufacture and Vehicle number */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year of manufacture <span className="text-red-500">**</span>
            </label>
            <select
              required
              value={vehicleData.yearOfManufacture}
              onChange={(e) => handleInputChange('yearOfManufacture', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">2001</option>
              {Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle number <span className="text-red-500">**</span>
            </label>
            <input
              type="text"
              required
              value={vehicleData.vehicleNumber}
              onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
          </div>
        </div>

        {/* Row 3: Seat capacity and Transmission type */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seat capacity <span className="text-red-500">**</span>
            </label>
            <select
              required
              value={vehicleData.seatCapacity}
              onChange={(e) => handleInputChange('seatCapacity', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">4</option>
              {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmission type <span className="text-red-500">**</span>
            </label>
            <select
              required
              value={vehicleData.transmissionType}
              onChange={(e) => handleInputChange('transmissionType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Manual</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="CVT">CVT</option>
            </select>
          </div>
        </div>

        {/* Row 4: Fuel type and Area */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              fuel type <span className="text-red-500">**</span>
            </label>
            <select
              required
              value={vehicleData.fuelType}
              onChange={(e) => handleInputChange('fuelType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">petrol</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
              <option value="CNG">CNG</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area <span className="text-red-500">**</span>
            </label>
            <input
              type="text"
              required
              value={vehicleData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
          </div>
        </div>

        {/* Row 5: Distric (full width) and Small Description */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distric <span className="text-red-500">**</span>
            </label>
            <select
              required
              value={vehicleData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Colombo</option>
              <option value="Colombo">Colombo</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Kalutara">Kalutara</option>
              <option value="Kandy">Kandy</option>
              <option value="Matale">Matale</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
              <option value="Galle">Galle</option>
              <option value="Matara">Matara</option>
              <option value="Hambantota">Hambantota</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Kilinochchi">Kilinochchi</option>
              <option value="Mannar">Mannar</option>
              <option value="Mullaitivu">Mullaitivu</option>
              <option value="Vavuniya">Vavuniya</option>
              <option value="Puttalam">Puttalam</option>
              <option value="Kurunegala">Kurunegala</option>
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Polonnaruwa">Polonnaruwa</option>
              <option value="Badulla">Badulla</option>
              <option value="Moneragala">Moneragala</option>
              <option value="Ratnapura">Ratnapura</option>
              <option value="Kegalle">Kegalle</option>
              <option value="Ampara">Ampara</option>
              <option value="Batticaloa">Batticaloa</option>
              <option value="Trincomalee">Trincomalee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Small Description <span className="text-red-500">**</span>
            </label>
            <textarea
              required
              value={vehicleData.smallDescription}
              onChange={(e) => handleInputChange('smallDescription', e.target.value)}
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder=""
            />
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Facilities</h3>
          <p className="text-sm text-gray-600 mb-4">select the other facilities in the vehicle</p>
          <div className="flex gap-8">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={vehicleData.features.includes('AC')}
                onChange={() => handleFeatureToggle('AC')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">AC</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={vehicleData.features.includes('Bluetooth')}
                onChange={() => handleFeatureToggle('Bluetooth')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Bluetooth</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={vehicleData.features.includes('USB charging')}
                onChange={() => handleFeatureToggle('USB charging')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">USB charging</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={vehicleData.features.includes('Sunroof')}
                onChange={() => handleFeatureToggle('Sunroof')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Sunroof</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={vehicleData.features.includes('Map')}
                onChange={() => handleFeatureToggle('Map')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Map</span>
            </label>
          </div>
        </div>

        {/* Vehicle Pictures */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Vehicle Pictures <span className="text-red-500">**</span>
          </h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Upload here
            </button>
            <p className="text-gray-500 mt-2">Or drag and drop files</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsTab;