import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import User from "../models/User.js"; // to verify package exists
import { sendEmail } from "../services/emailService.js";

/**
 * @desc    Create a new booking (tourist only)
 * @route   POST /api/bookings
 * @access  Private (tourist)
 */
export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const { packageId, whatsappNumber } = req.body;

    // 1) Load user to get email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const email = user.email; // now defined

    // 2) Verify package exists
    const pack = await Package.findById(packageId);
    if (!pack) {
      return res.status(404).json({ message: "Package not found" });
    }

    // 3) Create booking with userId, email, etc.
    const booking = await Booking.create({
      userId,
      email,
      packageId,
      whatsappNumber,
      status: "pending",
    });

    res.status(201).json({
      message: "Booking created, status pending",
      booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all bookings for the logged-in user
 * @route   GET /api/bookings
 * @access  Private (tourist)
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // populate package details if you like
    const bookings = await Booking.find({ userId })
      .populate("packageId", "name")
      .sort("-createdAt");

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Admin update booking status and notify tourist via email
 * @route   PUT /api/bookings/:id/status
 * @access  Admin only
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1) Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    // 2) Validate status
    if (!["pending", "confirmed", "cancelled", "approved"].includes(status)) {
      return res.status(400).json({
        message:
          "Status must be one of pending, confirmed, cancelled, approved",
      });
    }

    // 3) Find the booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 4) Update status
    booking.status = status;
    await booking.save();

    // 5) Send notification email
    ;
    if (status === "confirmed") {
      const subject = "Your booking has been confirmed!";
      const text = `Hello,\n\nYour booking has been ${status}. We will contact you on WhatsApp please check your WhatsApp messages.\n\nThank you for choosing us!`;
      await sendEmail(booking.email, subject, text);
    }else if (status === "cancelled") {
      const subject = "Your booking has been cancelled";
      const text = `Hello,\n\nYour booking has been ${status}. We are sorry for the inconvenience.\n\nThank you for your understanding!`;
      await sendEmail(booking.email, subject, text);
    } else if (status === "pending") {
      const subject = "Your booking is submitted and pending";
      const text = `Hello,\n\nYour booking is currently pending. We will update you soon.\n\nThank you for your patience!`;
      await sendEmail(booking.email, subject, text);
    }

    

    // 6) Respond
    res.json({
      message: `Booking status updated to "${status}" and user notified via email.`,
      booking,
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @desc    Get one booking by ID, with package title
 * @route   GET /api/bookings/:id
 * @access  Private (tourist)
 */
export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findOne({
      _id: id,
      userId: req.user.userId,
    }).populate("packageId", "name");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all bookings (admin only)
 * @route   GET /api/bookings/all
 * @access  Admin only
 */
export const getAllBookings = async (req, res, next) => {
  try {
    // Fetch every booking, populate the package title and the user’s name/email
    const bookings = await Booking.find()
      .populate("packageId", "name") // bring in package title
      .populate("userId", "name email") // bring in user name & email
      .sort("-createdAt");

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};
