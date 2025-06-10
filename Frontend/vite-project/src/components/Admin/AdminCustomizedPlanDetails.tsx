import React from "react";
import userImg from "../../assets/user.png";
import logo from "../../assets/logo.jpeg";

const dummyPlan = {
  user: {
    name: "Tony Stark",
    id: "ON-USA-3442343",
    country: "United states of America",
    email: "Tonystark@gmail.com",
    phone: "+1 345 323 5435",
    image: userImg,
  },
  plan: {
    adults: 2,
    children: 0,
    arrival: "24 .07.2025",
    departure: "28 .07.2025",
    days: 4,
    nights: 3,
    price: "$ 39.99",
  },
  flightDetails:
    "Direct flights from the USA to Colombo, Sri Lanka, are limited, with most routes having layovers in major hubs like Dubai, Doha, or Delhi. Airlines such as Emirates, Qatar Airways, and SriLankan Airlines operate these flights.",
  travelDetails: {
    interest: "Natural and wild life , beach and relaxation",
    places: "Ella , Arugambay beach , galle fort , sri pada",
  },
  accommodation: {
    budget: "Mid - range",
    roomType: "any room with neat and clean ambient",
    special: "we need a king size bed with lamp light setup",
  },
  transport: {
    budget: "Van , Train",
    pickup: "yes",
  },
  other: {
    meal: "Breakfast only",
    guide: "yes ( English )",
    approxBudget: "$30 to $60",
    specialRequest: "we plan for our honeymoon",
    language: "English",
  },
};

const AdminCustomizedPlanDetails: React.FC = () => (
  <div className="max-w-4xl mx-auto mb-16 overflow-hidden shadow-sm pt-20 relative z-10">
    {/* Top Bar */}
    <div className="flex items-center justify-between bg-[#23263A] px-6 py-4 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Travel Booking Sri Lanka" className="w-10 h-10 rounded-full bg-white" />
        <span className="font-semibold text-sky-300 text-base">Travel Booking Sri Lanka</span>
      </div>
      <span className="text-white text-sm font-medium">Srilankas best travelling organizer</span>
    </div>

    {/* Main Content */}
    <div className="p-8 bg-white rounded-b-2xl border-x border-b border-gray-300">
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        {/* User Info */}
        <div className="flex flex-col items-center md:items-start md:flex-row gap-6 flex-1">
          <img
            src={dummyPlan.user.image}
            alt={dummyPlan.user.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{dummyPlan.user.name}</h2>
            <div className="text-gray-700 mb-1">{dummyPlan.user.id}</div>
            <div className="text-gray-700 mb-1">{dummyPlan.user.country}</div>
            <div className="text-gray-700 mb-1">{dummyPlan.user.email}</div>
            <div className="text-gray-700 mb-1">{dummyPlan.user.phone}</div>
          </div>
        </div>
        {/* Plan Info */}
        <div className="flex-1 flex flex-col gap-1 text-gray-700 text-base border-l border-gray-200 pl-8">
          <div>No of Adults : <span className="font-semibold">{dummyPlan.plan.adults}</span></div>
          <div>No of Children : <span className="font-semibold">{dummyPlan.plan.children}</span></div>
          <div>Arrival data : <span className="font-semibold">{dummyPlan.plan.arrival}</span></div>
          <div>Departure data : <span className="font-semibold">{dummyPlan.plan.departure}</span></div>
          <div>No of Days : <span className="font-semibold">{dummyPlan.plan.days}</span></div>
          <div>No of Nights : <span className="font-semibold">{dummyPlan.plan.nights}</span></div>
          <div className="mt-2 text-right text-xl font-bold text-sky-500">
            Plan Price : <span className="text-[#0099E5]">{dummyPlan.plan.price}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-200" />

      {/* Flight Details */}
      <div className="mb-6">
        <h3 className="font-bold text-lg text-gray-900 mb-1">Flight details</h3>
        <p className="text-gray-700 text-sm">
          {dummyPlan.flightDetails}
        </p>
      </div>

      {/* Travel Details */}
      <div className="mb-6">
        <h3 className="font-bold text-lg text-gray-900 mb-1">Travel details</h3>
        <div className="text-gray-700 text-sm mb-1">
          <span className="font-semibold">Travel interest :</span>
          <span> {dummyPlan.travelDetails.interest}</span>
        </div>
        <div className="text-gray-700 text-sm">
          <span className="font-semibold">Places want to travel :</span>
          <span> {dummyPlan.travelDetails.places}</span>
        </div>
      </div>

      {/* Accommodation Details */}
      <div className="mb-6">
        <h3 className="font-bold text-lg text-gray-900 mb-1">Accommodation details</h3>
        <div className="text-gray-700 text-sm mb-1">
          <span className="font-semibold">Budjet :</span>
          <span> {dummyPlan.accommodation.budget}</span>
        </div>
        <div className="text-gray-700 text-sm mb-1">
          <span className="font-semibold">prefered room type :</span>
          <span> {dummyPlan.accommodation.roomType}</span>
        </div>
        <div className="text-gray-700 text-sm">
          <span className="font-semibold">Special need for Accommodation :</span>
          <span> {dummyPlan.accommodation.special}</span>
        </div>
      </div>

      {/* Transport Details */}
      <div className="mb-6">
        <h3 className="font-bold text-lg text-gray-900 mb-1">Transport details</h3>
        <div className="text-gray-700 text-sm mb-1">
          <span className="font-semibold">Budjet :</span>
          <span> {dummyPlan.transport.budget}</span>
        </div>
        <div className="text-gray-700 text-sm">
          <span className="font-semibold">Air port pickup/drop :</span>
          <span> {dummyPlan.transport.pickup}</span>
        </div>
      </div>

      {/* Other Details */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-1">Other details</h3>
        <div className="text-gray-700 text-sm mb-1">
          <span className="font-semibold">Meal plan Preference :</span>
          <span> {dummyPlan.other.meal}</span>
        </div>
        <div className="text-gray-700 text-sm mb-1">
          <span className="font-semibold">Need a tour guide :</span>
          <span> {dummyPlan.other.guide}</span>
        </div>
        <div className="text-gray-700 text-sm mb-1">
          <span className="font-semibold">Approximate Budjet :</span>
          <span> {dummyPlan.other.approxBudget}</span>
        </div>
        <div className="text-gray-700 text-sm mb-1">
          <span className="font-semibold">Special Request :</span>
          <span> {dummyPlan.other.specialRequest}</span>
        </div>
        <div className="text-gray-700 text-sm">
          <span className="font-semibold">Prefered Language :</span>
          <span> {dummyPlan.other.language}</span>
        </div>
      </div>
    </div>
  </div>
);

export default AdminCustomizedPlanDetails;