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

// sub‑schema for FAQs
const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer:   { type: String, required: true },
  },
  { _id: false }
);

// sub‑schema for Reviews
const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating:  { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

const hotelSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true,  },
    name:    { type: String, required: true, trim: true },
    description: String,

    address: {
      street: String,
      city:   String,
      state:  String,
      country:   String,
      postalCode: String,
      geoLocation: pointSchema,
    },

    contact: {
      phone:   String,
      email:   String,
      website: String,
    },

    amenities:   [String],
    starRating:  Number,
    roomTypes: [
      {
        name:         String,
        description:  String,
        pricePerNight:Number,
        totalRooms:   Number,
        amenities:    [String],
        maxOccupancy: Number,
      },
    ],

    images: [String],

    policies: {
      checkInTime:        String,
      checkOutTime:       String,
      cancellationPolicy: String,
      childrenAndBeds:    String,  // e.g. “Up to 2 children stay free; extra crib available”
      ageRestriction:     String,  // e.g. “No children under 12”
      petsAllowed:        Boolean, // true/false
    },

    // new FAQs field
    faqs: [faqSchema],

    // embed reviews (or you could pull them into a separate collection)
    reviews: [reviewSchema],

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
    timestamps: true,
  }
);

export default mongoose.model("Hotel", hotelSchema);
