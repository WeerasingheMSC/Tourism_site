import mongoose from "mongoose";

const customTourRequestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  country: { type: String, required: true },
  email: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  numberOfAdults: { type: Number, required: true },
  numberOfChildren: { type: Number, default: 0 },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  flightDetails: String, // Optional
  accommodationType: {
    type: [String],
    enum: ["Budget", "Mid-range", "Luxury", "Boutique", "Villa"],
    required: true,
  },
  preferredRoomType: { type: String, required: true },
  specialNeeds: String, // Optional
  travelInterests: {
    type: [String],
    enum: [
      "Culture & Heritage",
      "Nature & Wildlife",
      "Beaches & Relaxation",
      "Adventure & Activities",
      "Ayurveda & Wellness",
      "Local Food & Cooking",
      "Festivals & Events",
    ],
    required: true,
  },
  placesToVisit: String, // Optional
  daysToTravel: { type: Number, required: true },
  transportPreference: {
    type: [String],
    enum: ["Private Car", "Van", "Luxury Vehicle", "Train", "Domestic Flights"],
    required: true,
  },
  airportPickupDrop: { type: Boolean, required: true },
  mealPlan: {
    type: [String],
    enum: ["All meals", "Breakfast only", "No meals"],
    required: true,
  },
  dietaryRestrictions: String, // Optional
  tourGuideNeeded: {
    type: String,
    enum: ["Yes", "No", "Driver-guide"],
    required: true,
  },
  budget: { type: String, required: true },
  specialRequests: String, // Optional
  preferredLanguage: { type: String, required: true },
  approvalStatus: {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: String,
    reviewedAt: Date,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("CustomTourRequest", customTourRequestSchema);
