import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [lng, lat]
      index: "2dsphere",
    },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    date: Date,
    isAvailable: Boolean,
  },
  { _id: false }
);

const pickupLocationSchema = new mongoose.Schema(
  {
    name: String,
    geoLocation: pointSchema,
  },
  { _id: false }
);

const priceSchema = new mongoose.Schema(
  {
    perHour: Number,
    perDay: Number,
    perKilometer: Number,
  },
  { _id: false }
);

// FAQ schema for vehicle FAQs
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const approvalStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: String,
    reviewedAt: Date,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const vehicleSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    vehicleType: {
      type: String,
      enum: ["car", "van", "bus", "suv", "motorcycle","truck"],
      required: true,
    },
    make: String,
    model: String,
    year: Number,
    registrationNumber: String,
    seatCapacity: Number,
    transmission: { type: String, enum: ["manual", "automatic"] },
    fuelType: String,
    color: String,
    mileage: Number,
    airConditioning: { type: Boolean, default: false },
    location: {
      city: String,
      area: String,
      address: String,
      coordinates: [Number] // [longitude, latitude]
    },
    price: priceSchema,
    availability: [availabilitySchema],
    available: { type: Boolean, default: true },
    features: [String],
    images: [String],
    faqs: [faqSchema],
    pickupLocations: [pickupLocationSchema],
    policies: {
      cancellation: String,
      fuelPolicy: String,
      mileageLimit: String,
    },
    // Rating fields
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
      min: 0,
    },
    approvalStatus: approvalStatusSchema,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Vehicle", vehicleSchema);
