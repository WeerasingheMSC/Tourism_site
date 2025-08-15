import Booking from "../models/HotelBooking.js";
import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";

/**
 * @desc    Create a booking (tourist)
 * @route   POST /api/hotel-bookings
 * @access  Private (tourist)
 * @body    { hotelId, roomType, startDate, endDate, numRooms, contactNumber }
 */
export const createBooking = async (req, res, next) => {
  try {
    const { hotelId, roomType, startDate, endDate, numRooms, contactNumber } =
      req.body;

    // Basic validation
    if (
      !hotelId ||
      !roomType ||
      !startDate ||
      !endDate ||
      !numRooms ||
      !contactNumber
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid dates" });
    }
    if (end <= start) {
      return res
        .status(400)
        .json({ message: "endDate must be after startDate" });
    }

    // Load hotel (must be approved to accept bookings)
    const hotel = await Hotel.findById(hotelId).select(
      "name roomTypes approvalStatus"
    );
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    if (hotel.approvalStatus?.status !== "approved") {
      return res
        .status(400)
        .json({ message: "Hotel is not approved for booking" });
    }

    // Find the chosen room type and its current price
    const room = (hotel.roomTypes || []).find((rt) => rt.name === roomType);
    if (!room) {
      return res.status(400).json({ message: "Selected room type not found" });
    }
    if (typeof room.pricePerNight !== "number") {
      return res.status(400).json({ message: "Room type has no price set" });
    }

    // Calculate nights (ceil so partial days count as one night)
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const nights = Math.ceil((end - start) / MS_PER_DAY);
    if (nights < 1) {
      return res
        .status(400)
        .json({ message: "Booking must be at least 1 night" });
    }

    // Pricing snapshot
    const unitPrice = room.pricePerNight; // per night
    const totalPrice = unitPrice * nights * Number(numRooms);

    const booking = await Booking.create({
      hotelId,
      hotelName: hotel.name,
      roomType,
      startDate: start,
      endDate: end,
      numRooms,
      contactNumber,
      user: req.user.userId,

      // new price fields
      unitPrice,
      nights,
      totalPrice,
      currency: "USD", // switch to 'LKR' if you use LKR
    });
    // Try to notify the user by email
    // AFTER you create the booking successfully
try {
  // never call this variable "user" to avoid confusion with req.user
  const dbUser = await User.findById(req.user.userId).select('name email');
  const recipient = dbUser?.email; // or fallback to req.user?.email if you store it in the JWT

  if (recipient) {
    const fmt = d => new Date(d).toDateString();

    const subject = `Booking Made successfully: ${hotel.name}`;
    const text =
      `Hi ${dbUser?.name || 'there'},\n\n` +
      `Thanks for your booking at ${hotel.name}.\n\n` +
      `• Room type: ${roomType}\n` +
      `• Dates: ${fmt(startDate)} – ${fmt(endDate)}\n` +
      `• Rooms: ${numRooms}\n` +
      `• Price per night: $${unitPrice.toFixed(2)}\n` +
      `• Total: $${totalPrice.toFixed(2)}\n\n` +
      `We look forward to hosting you!\n`;

    await sendEmail(recipient, subject, text);
  }
} catch (mailErr) {
  console.error('Failed to send booking email:', mailErr);
}


    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get logged-in user’s bookings
 * @route   GET /api/hotel-bookings/me
 * @access  Private (tourist only)
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const bookings = await Booking.find({ user: userId })
      .populate("hotelId", "name address")
      .sort("-createdAt");
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    (Optional) Get all bookings for a specific hotel (owner only)
 * @route   GET /api/hotel-bookings/hotel/:hotelId
 * @access  Private (hotel-owner only)
 */
export const getHotelBookings = async (req, res, next) => {
  try {
    const ownerId = req.user.userId;
    const { hotelId } = req.params;

    // Validate hotel ownership
    const hotel = await Hotel.findOne({ _id: hotelId, ownerId });
    if (!hotel) {
      return res.status(403).json({ message: "Not authorized for this hotel" });
    }

    const bookings = await Booking.find({ hotelId })
      .populate("user", "name email")
      .sort("-createdAt");
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};
