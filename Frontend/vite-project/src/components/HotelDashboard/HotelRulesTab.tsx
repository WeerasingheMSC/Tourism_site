import { useState } from 'react';
import visa from "../../assets/visa.png";
import cash from "../../assets/cash.png";
import master from "../../assets/master.png";

const HotelRulesTab = () => {
  // State for form data
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    cancellationPolicy: '',
    childrenAndBeds: '',
    ageFrom: '1',
    ageTo: '60',
    pets: '',
    paymentMethods: [] as string[]
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle payment method selection
  const togglePaymentMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }));
  };
  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Hotel Rules</h2>
      <p className="text-gray-600 mb-6">Add your rules here</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check in <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check out <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder=""
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation/ prepayment <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.cancellationPolicy}
              onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="type the cancellation and payment details here"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Children and beds <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.childrenAndBeds}
              onChange={(e) => handleInputChange('childrenAndBeds', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="type here"
            />
          </div>
          
          <div className="flex items-center gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Restriction :
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">From</span>
                <select 
                  value={formData.ageFrom}
                  onChange={(e) => handleInputChange('ageFrom', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                </select>
                <span className="text-sm text-gray-700">To</span>
                <select 
                  value={formData.ageTo}
                  onChange={(e) => handleInputChange('ageTo', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>60</option>
                  <option>65</option>
                  <option>70</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pets :
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="pets" 
                  value="allowed"
                  checked={formData.pets === 'allowed'}
                  onChange={(e) => handleInputChange('pets', e.target.value)}
                  className="text-blue-600" 
                />
                <span className="text-sm text-gray-700">Allowed</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="pets" 
                  value="not-allowed"
                  checked={formData.pets === 'not-allowed'}
                  onChange={(e) => handleInputChange('pets', e.target.value)}
                  className="text-blue-600" 
                />
                <span className="text-sm text-gray-700">Not Allowed</span>
              </label>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method :
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => togglePaymentMethod('visa')}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    formData.paymentMethods.includes('visa')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img src={visa} alt="Visa" className="h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => togglePaymentMethod('cash')}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    formData.paymentMethods.includes('cash')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img src={cash} alt="Cash" className="h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => togglePaymentMethod('master')}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    formData.paymentMethods.includes('master')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <img src={master} alt="Mastercard" className="h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <button className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-400 font-medium">
            Back
          </button>
          <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 font-medium">
            Next
          </button>
        </div>
    </div>
  );
};

export default HotelRulesTab;