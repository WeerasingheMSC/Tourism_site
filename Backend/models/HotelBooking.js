import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    hotelName: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    numRooms: {
      type: Number,
      required: true,
      min: 1,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    // NEW: pricing snapshot
    unitPrice: {
      // price per night for this room type at the time of booking
      type: Number,
      required: true,
      min: 0,
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD', // change to 'LKR' if you prefer
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("HotelBooking", bookingSchema);
