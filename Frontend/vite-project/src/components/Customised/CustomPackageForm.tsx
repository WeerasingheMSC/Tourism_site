import React, { useState } from "react";

// Types
interface PersonalDetails {
  fullName: string;
  country: string;
  email: string;
  whatsapp: string;
  adults: number;
  children: number;
  arrivalDate: string;
  departureDate: string;
  flightDetails: string;
}

interface PackageDetails {
  budget: string;
  roomType: string;
  specialNeeds: string;
  travelInterests: string[];
  days: number;
  placesToVisit: string;
}

interface OtherDetails {
  transportBudget: string;
  airportPickup: string;
  mealPlan: string;
  guideNeeded: string;
  guideLanguage: string;
  tourBudgetFrom: number;
  tourBudgetTo: number;
  specialRequest: string;
  preferredLanguage: string;
}

// Step Header Component
const StepHeader = ({ currentStep, stepTitle }: { currentStep: number; stepTitle: string }) => {
  const steps = [
    { number: 1, title: "Personal Details" },
    { number: 2, title: "Package Details" },
    { number: 3, title: "Other Details" }
  ];

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-medium transition-colors duration-200 ${
                currentStep >= step.number 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <div className={`mt-2 text-xs sm:text-sm font-medium text-center max-w-20 sm:max-w-none ${
                currentStep >= step.number ? 'text-blue-500' : 'text-gray-500'
              }`}>
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.title.split(' ')[0]}</span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-200 ${
                currentStep > step.number ? 'bg-blue-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Current Step Title */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{stepTitle}</h2>
        <p className="text-sm sm:text-base text-gray-600">Step {currentStep} of 3</p>
      </div>
    </div>
  );
};

// Step 1: Personal Details
const StepPersonalDetails = ({ data, setData, next }: {
  data: PersonalDetails;
  setData: React.Dispatch<React.SetStateAction<PersonalDetails>>;
  next: () => void;
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.fullName) newErrors.fullName = "Full name is required.";
    if (!data.country) newErrors.country = "Country is required.";
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Valid email is required.";
    if (!data.whatsapp) newErrors.whatsapp = "WhatsApp number is required.";
    if (!data.arrivalDate) newErrors.arrivalDate = "Arrival date is required.";
    if (!data.departureDate) newErrors.departureDate = "Departure date is required.";
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      next();
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <StepHeader currentStep={1} stepTitle="Personal Details" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block font-medium mb-2 text-gray-700">Full Name<span className="text-red-500">*</span></label>
          <input 
            name="fullName" 
            value={data.fullName} 
            onChange={handleChange} 
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200" 
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Country<span className="text-red-500">*</span></label>
          <input 
            name="country" 
            value={data.country} 
            onChange={handleChange} 
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200" 
          />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Email Address<span className="text-red-500">*</span></label>
          <input 
            name="email" 
            type="email" 
            value={data.email} 
            onChange={handleChange} 
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200" 
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">WhatsApp Number<span className="text-red-500">*</span></label>
          <input 
            name="whatsapp" 
            value={data.whatsapp} 
            onChange={handleChange} 
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200" 
          />
          {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block font-medium mb-2 text-gray-700">Adults</label>
          <input 
            type="number" 
            name="adults" 
            value={data.adults} 
            min={1} 
            onChange={handleChange} 
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200" 
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Children</label>
          <input 
            type="number" 
            name="children" 
            value={data.children} 
            min={0} 
            onChange={handleChange} 
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200" 
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Arrival Date<span className="text-red-500">*</span></label>
          <input 
            type="date" 
            name="arrivalDate" 
            value={data.arrivalDate} 
            onChange={handleChange} 
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200" 
          />
          {errors.arrivalDate && <p className="text-red-500 text-sm mt-1">{errors.arrivalDate}</p>}
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Departure Date<span className="text-red-500">*</span></label>
          <input 
            type="date" 
            name="departureDate" 
            value={data.departureDate} 
            onChange={handleChange} 
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200" 
          />
          {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate}</p>}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-700">Flight Details</label>
        <textarea 
          name="flightDetails" 
          value={data.flightDetails} 
          onChange={handleChange} 
          className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200 resize-vertical" 
          rows={3} 
          placeholder="Type the text here..." 
        />
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="button" 
          onClick={handleNext} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Step 2: Package Details
const StepPackageDetails = ({ data, setData, next, back }: {
  data: PackageDetails;
  setData: React.Dispatch<React.SetStateAction<PackageDetails>>;
  next: () => void;
  back: () => void;
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const travelOptions = [
    "Nature & Wildlife",
    "Beaches & Relaxation",
    "Adventure & Activities",
    "Ayurveda & Wellness",
    "Local Food & Cooking",
    "Festivals & Events"
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.budget) newErrors.budget = "Budget selection is required.";
    if (!data.roomType) newErrors.roomType = "Room type is required.";
    if (data.travelInterests.length === 0) newErrors.travelInterests = "Select at least one travel interest.";
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      next();
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (interest: string) => {
    const exists = data.travelInterests.includes(interest);
    const updated = exists
      ? data.travelInterests.filter(item => item !== interest)
      : [...data.travelInterests, interest];
    setData({ ...data, travelInterests: updated });
  };

  return (
    <div className="space-y-6">
      <StepHeader currentStep={2} stepTitle="Package Details" />

      <div>
        <label className="block font-medium mb-3 text-gray-700">Budget <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Mid-range", "Luxury", "Boutique", "Villa"].map((type) => (
            <label key={type} className="flex items-center gap-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200">
              <input
                type="radio"
                name="budget"
                value={type}
                checked={data.budget === type}
                onChange={handleChange}
                className="text-blue-500"
              />
              <span className="text-sm sm:text-base">{type}</span>
            </label>
          ))}
        </div>
        {errors.budget && <p className="text-red-500 text-sm mt-2">{errors.budget}</p>}
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-700">Preferred Room Type <span className="text-red-500">*</span></label>
        <input
          name="roomType"
          value={data.roomType}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200"
          placeholder="e.g., Double Room, Suite"
        />
        {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>}
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-700">Special Needs for Accommodation</label>
        <textarea
          name="specialNeeds"
          value={data.specialNeeds}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200 resize-vertical"
          rows={3}
        />
      </div>

      <div>
        <label className="block font-medium mb-3 text-gray-700">What are your travel interests? <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {travelOptions.map((interest) => (
            <label key={interest} className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200">
              <input
                type="checkbox"
                checked={data.travelInterests.includes(interest)}
                onChange={() => handleCheckboxChange(interest)}
                className="text-blue-500"
              />
              <span className="text-sm sm:text-base">{interest}</span>
            </label>
          ))}
        </div>
        {errors.travelInterests && <p className="text-red-500 text-sm mt-2">{errors.travelInterests}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block font-medium mb-2 text-gray-700">How many days do you want to travel?</label>
          <select
            name="days"
            value={data.days}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Places you want to visit in Sri Lanka</label>
          <input
            name="placesToVisit"
            value={data.placesToVisit}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200"
            placeholder="e.g., Sigiriya, Ella, Mirissa"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <button 
          onClick={back} 
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button 
          onClick={handleNext} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Step 3: Other Details
const StepOtherDetails = ({ data, setData, back, submit }: {
  data: OtherDetails;
  setData: React.Dispatch<React.SetStateAction<OtherDetails>>;
  back: () => void;
  submit: () => void;
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.transportBudget) newErrors.transportBudget = "Transport budget is required.";
    if (!data.mealPlan) newErrors.mealPlan = "Meal plan is required.";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      submit();
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6">
      <StepHeader currentStep={3} stepTitle="Other Details" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block font-medium mb-2 text-gray-700">Transport Budget <span className="text-red-500">*</span></label>
          <input
            name="transportBudget"
            value={data.transportBudget}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200"
            placeholder="e.g., Mid-range, Luxury"
          />
          {errors.transportBudget && <p className="text-red-500 text-sm mt-1">{errors.transportBudget}</p>}
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Airport Pickup Required?</label>
          <select
            name="airportPickup"
            value={data.airportPickup}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-700">Meal Plan <span className="text-red-500">*</span></label>
        <select
          name="mealPlan"
          value={data.mealPlan}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200"
        >
          <option value="">Select</option>
          <option value="Breakfast Only">Breakfast Only</option>
          <option value="Half Board">Half Board</option>
          <option value="Full Board">Full Board</option>
        </select>
        {errors.mealPlan && <p className="text-red-500 text-sm mt-1">{errors.mealPlan}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block font-medium mb-2 text-gray-700">Do You Need a Guide?</label>
          <select
            name="guideNeeded"
            value={data.guideNeeded}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Guide Language Preference</label>
          <input
            name="guideLanguage"
            value={data.guideLanguage}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200"
            placeholder="e.g., English, French"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block font-medium mb-2 text-gray-700">Tour Budget From (USD)</label>
          <input
            type="number"
            name="tourBudgetFrom"
            value={data.tourBudgetFrom}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block font-medium mb-2 text-gray-700">Tour Budget To (USD)</label>
          <input
            type="number"
            name="tourBudgetTo"
            value={data.tourBudgetTo}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-700">Any Special Request?</label>
        <textarea
          name="specialRequest"
          value={data.specialRequest}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200 resize-vertical"
          rows={3}
        />
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-700">Preferred Language</label>
        <input
          name="preferredLanguage"
          value={data.preferredLanguage}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-md px-3 py-2 transition-colors duration-200"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <button 
          onClick={back} 
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button 
          onClick={handleSubmit} 
          className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 sm:px-8 py-2 sm:py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// Success Modal
const StepSuccessModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4">
        <div className="text-4xl sm:text-5xl text-green-500 mb-4">✓</div>
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-800">Success!</h2>
        <p className="text-gray-600 text-sm sm:text-base">Your customised package request has been submitted successfully.</p>
      </div>
    </div>
  );
};

// Main Form Component
const CustomPackageForm = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [personal, setPersonal] = useState<PersonalDetails>({
    fullName: "", country: "", email: "", whatsapp: "", adults: 2, children: 0,
    arrivalDate: "", departureDate: "", flightDetails: ""
  });

  const [pkg, setPkg] = useState<PackageDetails>({
    budget: "", roomType: "", specialNeeds: "", travelInterests: [], days: 1, placesToVisit: ""
  });

  const [other, setOther] = useState<OtherDetails>({
    transportBudget: "", airportPickup: "", mealPlan: "", guideNeeded: "", guideLanguage: "",
    tourBudgetFrom: 30, tourBudgetTo: 60, specialRequest: "", preferredLanguage: "English"
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  const handleSubmit = () => setSubmitted(true);

  return (
    <div className="min-h-screen p-4 bg-white py-4 sm:py-8 px-4">
      <div className="max-w-4xl  mx-auto">
        <div className="bg-white/10 backdrop-blur-lg backdrop-saturate-150 border border-white/20 rounded-xl p-4 sm:p-8">
          {step === 1 && <StepPersonalDetails data={personal} setData={setPersonal} next={handleNext} />}
          {step === 2 && <StepPackageDetails data={pkg} setData={setPkg} next={handleNext} back={handleBack} />}
          {step === 3 && <StepOtherDetails data={other} setData={setOther} back={handleBack} submit={handleSubmit} />}
          {submitted && <StepSuccessModal />}
        </div>
      </div>
    </div>
  );
};

export default CustomPackageForm;