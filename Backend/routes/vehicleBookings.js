import express from 'express';
import { body } from 'express-validator';
import {
  getAllVehicleBookings,
  getVehicleBookingById,
  createVehicleBooking,
  updateVehicleBooking,
  updateBookingStatus,
  deleteVehicleBooking,
  getBookingStatistics
} from '../controllers/vehicleBookingController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Validation rules for creating vehicle booking
const createBookingValidation = [
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.email').isEmail().withMessage('Valid email is required'),
  body('customer.phone').notEmpty().withMessage('Customer phone is required'),
  body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
  body('booking.startDate').isISO8601().withMessage('Valid start date is required'),
  body('booking.endDate').isISO8601().withMessage('Valid end date is required'),
  body('booking.pickupLocation').notEmpty().withMessage('Pickup location is required'),
  body('booking.dropoffLocation').notEmpty().withMessage('Dropoff location is required'),
  body('pricing.basePrice').isNumeric().withMessage('Base price must be a number'),
  body('pricing.totalAmount').isNumeric().withMessage('Total amount must be a number')
];

// Validation rules for updating booking status
const statusUpdateValidation = [
  body('status').isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled'])
    .withMessage('Invalid status value')
];

// GET /api/vehicle-bookings - Get all vehicle bookings with filtering (public access for viewing)
router.get('/', getAllVehicleBookings);

// GET /api/vehicle-bookings/my-bookings - Get bookings for current owner's vehicles (protected)
router.get('/my-bookings', auth, getAllVehicleBookings);

// GET /api/vehicle-bookings/statistics - Get booking statistics
router.get('/statistics', auth, getBookingStatistics);

// GET /api/vehicle-bookings/:id - Get single vehicle booking (public access for viewing)
router.get('/:id', getVehicleBookingById);

// POST /api/vehicle-bookings - Create new vehicle booking
router.post('/', auth, createBookingValidation, createVehicleBooking);

// PUT /api/vehicle-bookings/:id - Update vehicle booking
router.put('/:id', auth, updateVehicleBooking);

// PATCH /api/vehicle-bookings/:id/status - Update booking status
router.patch('/:id/status', auth, statusUpdateValidation, updateBookingStatus);

// DELETE /api/vehicle-bookings/:id - Delete vehicle booking
router.delete('/:id', auth, deleteVehicleBooking);

export default router;
