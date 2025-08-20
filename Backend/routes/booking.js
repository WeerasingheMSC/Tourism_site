import express from "express";
import { body, validationResult } from "express-validator";

import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getAllBookings,
} from "../controllers/bookingController.js";
import auth from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";

const router = express.Router();

// Validation for creating a booking
const bookingValidation = [
  body("packageId").isMongoId().withMessage("Valid packageId is required"),
  body("whatsappNumber")
    .matches(/^\+\d{7,15}$/)
    .withMessage(
      "WhatsApp number must be in international format, e.g. +94771234567"
    ),
];

// POST /api/bookings → create a new booking
router.post(
  "/",
  auth,
  authorizeRoles("tourist"),
  bookingValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    createBooking(req, res, next);
  }
);

// GET /api/bookings → list bookings for this tourist
router.get("/", auth, authorizeRoles("tourist"), getMyBookings);

// Admin: Update booking status
router.put(
  "/:id/status",
  auth,
  authorizeRoles("admin"), // only admin can hit this
  body("status")
    .isIn(["pending", "confirmed", "cancelled", "approved"])
    .withMessage("Invalid status value"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    updateBookingStatus(req, res, next);
  }
);

router.get(
  "/all",
  auth,
  authorizeRoles("admin"), // only admins can call this
  getAllBookings
);
export default router;
