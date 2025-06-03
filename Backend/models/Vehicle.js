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
      enum: ["car", "van", "bus", "minibus", "coach"],
      required: true,
    },
    make: String,
    model: String,
    year: Number,
    registrationNumber: String,
    seatCapacity: Number,
    transmission: { type: String, enum: ["manual", "automatic"] },
    fuelType: String,
    price: priceSchema,
    availability: [availabilitySchema],
    features: [String],
    images: [String],
    pickupLocations: [pickupLocationSchema],
    policies: {
      cancellation: String,
      fuelPolicy: String,
      mileageLimit: String,
    },
    approvalStatus: approvalStatusSchema,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Vehicle", vehicleSchema);
