// src/components/CustomPackageForm.tsx
import React, { useState } from "react";
import { submitTourRequest } from "../../api/customTourRequest"; // your Axios helper

// -----------------------------------
// Types for our three form slices
// -----------------------------------
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
  transportPreference: string;
  airportPickup: string;
  mealPlan: string;
  guideNeeded: string;
  guideLanguage: string;
  budget: string;
  //tourBudgetTo: number;
  specialRequest: string;
  preferredLanguage: string;
}

// -----------------------------------
// StepHeader shows the 3-step progress
// -----------------------------------
const StepHeader: React.FC<{ currentStep: number; stepTitle: string }> = ({
  currentStep,
  stepTitle,
}) => {
  const steps = [
    { number: 1, title: "Personal Details" },
    { number: 2, title: "Package Details" },
    { number: 3, title: "Other Details" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, idx) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-medium transition-colors duration-200 ${
                  currentStep >= step.number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.number ? "✓" : step.number}
              </div>
              <div
                className={`mt-2 text-xs sm:text-sm font-medium text-center max-w-20 sm:max-w-none ${
                  currentStep >= step.number ? "text-blue-500" : "text-gray-500"
                }`}
              >
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.title.split(" ")[0]}</span>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-200 ${
                  currentStep > step.number ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          {stepTitle}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Step {currentStep} of 3
        </p>
      </div>
    </div>
  );
};

// -----------------------------------
// Step 1: Personal Details
// -----------------------------------
const StepPersonalDetails: React.FC<{
  data: PersonalDetails;
  setData: React.Dispatch<React.SetStateAction<PersonalDetails>>;
  next: () => void;
}> = ({ data, setData, next }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.fullName) errs.fullName = "Full name is required.";
    if (!data.country) errs.country = "Country is required.";
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
      errs.email = "Valid email is required.";
    if (!data.whatsapp) errs.whatsapp = "WhatsApp number is required.";
    if (!data.arrivalDate) errs.arrivalDate = "Arrival date is required.";
    if (!data.departureDate) errs.departureDate = "Departure date is required.";
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length === 0) {
      next();
    } else {
      setErrors(errs);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader currentStep={1} stepTitle="Personal Details" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {[
          { name: "fullName", label: "Full Name", type: "text" },
          { name: "country", label: "Country", type: "text" },
          { name: "email", label: "Email Address", type: "email" },
          { name: "whatsapp", label: "WhatsApp Number", type: "text" },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="block font-medium mb-2 text-gray-700">
              {label}
              <span className="text-red-500">*</span>
            </label>
            <input
              name={name}
              type={type}
              value={(data as any)[name]}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
            />
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block font-medium mb-2 text-gray-700">Adults</label>
          <input
            name="adults"
            type="number"
            min={1}
            value={data.adults}
            onChange={(e) =>
              setData({ ...data, adults: Number(e.target.value) })
            }
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Children
          </label>
          <input
            name="children"
            type="number"
            min={0}
            value={data.children}
            onChange={(e) =>
              setData({ ...data, children: Number(e.target.value) })
            }
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Arrival Date
            <span className="text-red-500">*</span>
          </label>
          <input
            name="arrivalDate"
            type="date"
            value={data.arrivalDate}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
          />
          {errors.arrivalDate && (
            <p className="text-red-500 text-sm mt-1">{errors.arrivalDate}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Departure Date
            <span className="text-red-500">*</span>
          </label>
          <input
            name="departureDate"
            type="date"
            value={data.departureDate}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
          />
          {errors.departureDate && (
            <p className="text-red-500 text-sm mt-1">{errors.departureDate}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-700">
          Flight Details
        </label>
        <textarea
          name="flightDetails"
          value={data.flightDetails}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200 resize-vertical"
          rows={3}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={handleNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// -----------------------------------
// Step 2: Package Details
// -----------------------------------
const StepPackageDetails: React.FC<{
  data: PackageDetails;
  setData: React.Dispatch<React.SetStateAction<PackageDetails>>;
  next: () => void;
  back: () => void;
}> = ({ data, setData, next, back }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const travelOptions = [
    "Culture & Heritage",
    "Nature & Wildlife",
    "Beaches & Relaxation",
    "Adventure & Activities",
    "Ayurveda & Wellness",
    "Local Food & Cooking",
    "Festivals & Events",
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.budget) errs.budget = "Budget selection is required.";
    if (!data.roomType) errs.roomType = "Room type is required.";
    if (data.travelInterests.length === 0)
      errs.travelInterests = "Select at least one travel interest.";
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length === 0) {
      next();
    } else {
      setErrors(errs);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const toggleInterest = (interest: string) => {
    const has = data.travelInterests.includes(interest);
    setData({
      ...data,
      travelInterests: has
        ? data.travelInterests.filter((i) => i !== interest)
        : [...data.travelInterests, interest],
    });
    if (errors.travelInterests) {
      setErrors({ ...errors, travelInterests: "" });
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader currentStep={2} stepTitle="Package Details" />

      {/* Budget Radios */}
      <div>
        <label className="block font-medium mb-3 text-gray-700">
          Accommodation Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Budget", "Mid-range", "Luxury", "Boutique", "Villa"].map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <input
                type="radio"
                name="budget"
                value={opt}
                checked={data.budget === opt}
                onChange={handleChange}
                className="text-blue-500"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
        {errors.budget && (
          <p className="text-red-500 text-sm mt-2">{errors.budget}</p>
        )}
      </div>

      {/* Room Type */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          Preferred Room Type <span className="text-red-500">*</span>
        </label>
        <input
          name="roomType"
          value={data.roomType}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
          placeholder="e.g., Double Room, Suite"
        />
        {errors.roomType && (
          <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>
        )}
      </div>

      {/* Special Needs */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          Special Needs for Accommodation
        </label>
        <textarea
          name="specialNeeds"
          value={data.specialNeeds}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200 resize-vertical"
          rows={3}
        />
      </div>

      {/* Travel Interests */}
      <div>
        <label className="block font-medium mb-3 text-gray-700">
          What are your travel interests?{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {travelOptions.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <input
                type="checkbox"
                checked={data.travelInterests.includes(opt)}
                onChange={() => toggleInterest(opt)}
                className="text-blue-500"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
        {errors.travelInterests && (
          <p className="text-red-500 text-sm mt-2">{errors.travelInterests}</p>
        )}
      </div>

      {/* Days & Places */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            How many days do you want to travel?
          </label>
          <select
            name="days"
            value={data.days}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Places you want to visit in Sri Lanka
          </label>
          <input
            name="placesToVisit"
            value={data.placesToVisit}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
            placeholder="e.g., Sigiriya, Ella, Mirissa"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={back}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// -----------------------------------
// Step 3: Other Details
// -----------------------------------
const StepOtherDetails: React.FC<{
  data: OtherDetails;
  setData: React.Dispatch<React.SetStateAction<OtherDetails>>;
  back: () => void;
  submit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}> = ({ data, setData, back, submit, isSubmitting, submitError }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!data.transportPreference)
      errs.transportPreference = "Transport budget is required.";
    if (!data.mealPlan) errs.mealPlan = "Meal plan is required.";
    return errs;
  };

  const handleClick = () => {
    const errs = validate();
    if (Object.keys(errs).length === 0) {
      submit();
    } else {
      setErrors(errs);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader currentStep={3} stepTitle="Other Details" />

      {/* Transport Preference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Transport Preference <span className="text-red-500">*</span>
          </label>
          <select
            name="transportPreference"
            value={data.transportPreference}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
            required
          >
            <option value="" disabled>
              Select transport…
            </option>
            <option value="Private Car">Private Car</option>
            <option value="Van">Van</option>
            <option value="Luxury Vehicle">Luxury Vehicle</option>
            <option value="Train">Train</option>
            <option value="Domestic Flights">Domestic Flights</option>
          </select>
          {errors.transportPreference && (
            <p className="text-red-500 text-sm mt-1">
              {errors.transportPreference}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Airport Pickup Required?
          </label>
          <select
            name="airportPickup"
            value={data.airportPickup}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* Meal Plan */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          Meal Plan <span className="text-red-500">*</span>
        </label>
        <select
          name="mealPlan"
          value={data.mealPlan}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
        >
          <option value="">Select</option>
          <option value="All meals">All meals</option>
          <option value="Breakfast only">Breakfast only</option>
          <option value="No meals">No meals</option>
        </select>
        {errors.mealPlan && (
          <p className="text-red-500 text-sm mt-1">{errors.mealPlan}</p>
        )}
      </div>

      {/* Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Do You Need a Guide?
          </label>
          <select
            name="guideNeeded"
            value={data.guideNeeded}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Driver-guide">Driver-guide</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Guide Language Preference
          </label>
          <input
            name="guideLanguage"
            value={data.guideLanguage}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
            placeholder="e.g. English, French"
          />
        </div>
      </div>

      {/* Budget Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-2 text-gray-700">
            Tour Budget (USD)
          </label>
          <input
            name="budget"
            type="text"
            value={data.budget}
            onChange={handleChange}
            className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
          />
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          Any Special Request?
        </label>
        <textarea
          name="specialRequest"
          value={data.specialRequest}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200 resize-vertical"
          rows={3}
        />
      </div>

      {/* Preferred Language */}
      <div>
        <label className="block font-medium mb-2 text-gray-700">
          Preferred Language
        </label>
        <input
          name="preferredLanguage"
          value={data.preferredLanguage}
          onChange={handleChange}
          className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-md px-3 py-2 transition-colors duration-200"
        />
      </div>

      {submitError && <p className="text-red-500 text-center">{submitError}</p>}

      <div className="flex justify-between pt-4">
        <button
          onClick={back}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200"
        >
          Back
        </button>
        <button
          onClick={handleClick}
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-md text-white transition-colors duration-200 ${
            isSubmitting
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
};

// -----------------------------------
// Success Overlay
// -----------------------------------
const StepSuccessModal: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
    <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-md w-full mx-4">
      <div className="text-4xl text-green-500 mb-4">✓</div>
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">Success!</h2>
      <p className="text-gray-600">
        Your customised package request has been submitted successfully.
      </p>
    </div>
  </div>
);

// -----------------------------------
// Main Multi-Step Form
// -----------------------------------
const CustomPackageForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [personal, setPersonal] = useState<PersonalDetails>({
    fullName: "",
    country: "",
    email: "",
    whatsapp: "",
    adults: 2,
    children: 0,
    arrivalDate: "",
    departureDate: "",
    flightDetails: "",
  });

  const [pkg, setPkg] = useState<PackageDetails>({
    budget: "",
    roomType: "",
    specialNeeds: "",
    travelInterests: [],
    days: 1,
    placesToVisit: "",
  });

  const [other, setOther] = useState<OtherDetails>({
    transportPreference: "",
    airportPickup: "",
    mealPlan: "",
    guideNeeded: "",
    guideLanguage: "",
    budget: "",
    //tourBudgetTo: 0,
    specialRequest: "",
    preferredLanguage: "",
  });

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  // final submission to backend
  const handleFinalSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    const payload = {
      fullName: personal.fullName,
      country: personal.country,
      email: personal.email,
      whatsappNumber: personal.whatsapp,
      numberOfAdults: personal.adults,
      numberOfChildren: personal.children,
      arrivalDate: personal.arrivalDate,
      departureDate: personal.departureDate,
      flightDetails: personal.flightDetails,

      accommodationType: [pkg.budget],
      preferredRoomType: pkg.roomType,
      specialNeeds: pkg.specialNeeds,
      travelInterests: pkg.travelInterests,
      placesToVisit: pkg.placesToVisit,
      daysToTravel: pkg.days,

      transportPreference: [other.transportPreference],
      airportPickupDrop: other.airportPickup === "Yes",
      mealPlan: [other.mealPlan],
      dietaryRestrictions: "",
      tourGuideNeeded: other.guideNeeded,
      budget: other.budget,
      specialRequests: other.specialRequest,
      preferredLanguage: other.preferredLanguage,
    };

    try {
      await submitTourRequest(payload);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(
        err.response?.data?.message || "Failed to submit request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg border border-white/40 shadow-2xl rounded-xl p-4 sm:p-8">
          {step === 1 && (
            <StepPersonalDetails
              data={personal}
              setData={setPersonal}
              next={handleNext}
            />
          )}
          {step === 2 && (
            <StepPackageDetails
              data={pkg}
              setData={setPkg}
              back={handleBack}
              next={handleNext}
            />
          )}
          {step === 3 && (
            <StepOtherDetails
              data={other}
              setData={setOther}
              back={handleBack}
              submit={handleFinalSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}
          {submitted && <StepSuccessModal />}
        </div>
      </div>
    </div>
  );
};

export default CustomPackageForm;
