import express from 'express';
import {
  createBooking,
  getMyBookings,
  getHotelBookings
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

export default router;
