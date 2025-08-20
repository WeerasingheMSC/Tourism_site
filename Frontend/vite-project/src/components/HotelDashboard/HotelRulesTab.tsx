// src/components/HotelRulesTab.tsx
import React, { type Dispatch, type SetStateAction } from "react";
import visa from "../../assets/visa.png";
import cash from "../../assets/cash.png";
import master from "../../assets/master.png";

export interface RulesType {
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  childrenAndBeds: string;
  ageFrom: string;
  ageTo: string;
  petsAllowed: boolean;
  paymentMethods: string[];
}

export interface HotelRulesTabProps {
  rules: RulesType;
  setRules: Dispatch<SetStateAction<RulesType>>;
}

const HotelRulesTab: React.FC<HotelRulesTabProps> = ({
  rules,
  setRules,
}) => {
  // Handle text inputs & textareas
  const handleInputChange = (field: keyof RulesType, value: string) => {
    setRules((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle boolean for petsAllowed
  const handlePetsChange = (allowed: boolean) => {
    setRules((prev) => ({
      ...prev,
      petsAllowed: allowed,
    }));
  };

  // Toggle payment methods array
  const togglePaymentMethod = (method: string) => {
    setRules((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method],
    }));
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Hotel Rules</h2>
      <p className="text-gray-600 mb-6">Add your rules here</p>

      <div className="space-y-6">
        {/* Check In */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check in
          </label>
          <input
            type="text"
            required
            value={rules.checkIn}
            onChange={(e) => handleInputChange("checkIn", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Check Out */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check out
          </label>
          <input
            type="text"
            required
            value={rules.checkOut}
            onChange={(e) => handleInputChange("checkOut", e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cancellation / Prepayment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cancellation/ prepayment
          </label>
          <textarea
            rows={4}
            required
            value={rules.cancellationPolicy}
            onChange={(e) =>
              handleInputChange("cancellationPolicy", e.target.value)
            }
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="type the cancellation and payment details here"
          />
        </div>

        {/* Children & Beds */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Children and beds
          </label>
          <textarea
            rows={3}
            required
            value={rules.childrenAndBeds}
            onChange={(e) =>
              handleInputChange("childrenAndBeds", e.target.value)
            }
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="type here"
          />
        </div>

        {/* Age Restriction */}
        <div className="flex items-center gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Restriction:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">From</span>
              <select
                value={rules.ageFrom}
                onChange={(e) => handleInputChange("ageFrom", e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
              <span className="text-sm text-gray-700">To</span>
              <select
                value={rules.ageTo}
                onChange={(e) => handleInputChange("ageTo", e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>60</option>
                <option>65</option>
                <option>70</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pets Allowed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pets:
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pets"
                checked={rules.petsAllowed === true}
                onChange={() => handlePetsChange(true)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">Allowed</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pets"
                checked={rules.petsAllowed === false}
                onChange={() => handlePetsChange(false)}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">Not Allowed</span>
            </label>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Payment Method:
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => togglePaymentMethod("visa")}
                className={`p-2 rounded-lg border-2 transition-all ${
                  rules.paymentMethods.includes("visa")
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img src={visa} alt="Visa" className="h-6" />
              </button>
              <button
                type="button"
                onClick={() => togglePaymentMethod("cash")}
                className={`p-2 rounded-lg border-2 transition-all ${
                  rules.paymentMethods.includes("cash")
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img src={cash} alt="Cash" className="h-6" />
              </button>
              <button
                type="button"
                onClick={() => togglePaymentMethod("master")}
                className={`p-2 rounded-lg border-2 transition-all ${
                  rules.paymentMethods.includes("master")
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img src={master} alt="Mastercard" className="h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRulesTab;
