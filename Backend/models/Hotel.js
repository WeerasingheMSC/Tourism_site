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

const hotelSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      geoLocation: pointSchema,
    },
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    amenities: [String],
    starRating: Number,
    roomTypes: [
      {
        name: String,
        description: String,
        pricePerNight: Number,
        totalRooms: Number,
        amenities: [String],
        maxOccupancy: Number,
      },
    ],
    images: [String],
    policies: {
      checkInTime: String,
      checkOutTime: String,
      cancellationPolicy: String,
    },
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
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default mongoose.model("Hotel", hotelSchema);
