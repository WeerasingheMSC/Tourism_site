import Booking from '../models/HotelBooking.js';
import Hotel from '../models/Hotel.js';
import mongoose from 'mongoose';

/**
 * @desc    Create a new booking for logged-in user
 * @route   POST /api/hotel-bookings
 * @access  Private (tourist only)
 */
export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { hotelId, roomType, startDate, endDate, numRooms, contactNumber } = req.body;

    // Validate hotel ID
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: 'Invalid hotel ID' });
    }

    // Basic validation
    if (!startDate || !endDate || !numRooms || !contactNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Fetch hotel name
    const hotel = await Hotel.findById(hotelId);
    if (!hotel || hotel.approvalStatus.status !== 'approved') {
      return res.status(404).json({ message: 'Hotel not found or not approved' });
    }

    // Create booking
    const booking = await Booking.create({
      hotelId,
      hotelName: hotel.name,
      roomType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      numRooms,
      contactNumber,
      user: userId
    });

    res.status(201).json({ message: 'Booking created', booking });
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
      .populate('hotelId', 'name address')
      .sort('-createdAt');
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
      return res.status(403).json({ message: 'Not authorized for this hotel' });
    }

    const bookings = await Booking.find({ hotelId })
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};
