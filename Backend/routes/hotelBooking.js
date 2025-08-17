import express from 'express';
import {
  createBooking,
  getMyBookings,
  getHotelBookings,
  updateBookingStatus,
  getAllHotelBookings
} from '../controllers/hotelBookingController.js';
import auth from '../middleware/auth.js';
import { authorizeRoles } from "../middleware/roles.js";

const router = express.Router();

// POST /api/hotel-bookings
router.post('/', auth, createBooking);

// GET /api/hotel-bookings/me
router.get('/me', auth, getMyBookings);

// (Optional) GET /api/hotel-bookings/hotel/:hotelId
router.get(
  '/hotel/:hotelId',
  auth,
  authorizeRoles('hotel-owner'),
  getHotelBookings
);

// NEW: update status (admin)
router.put('/:id/status', auth, authorizeRoles('admin'), updateBookingStatus);

// ADMIN: list all hotel bookings
router.get('/', auth, authorizeRoles('admin'), getAllHotelBookings);

export default router;
