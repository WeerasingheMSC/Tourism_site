import express from "express";
import { body, validationResult } from "express-validator";

import {
  registerHotel,
  getPendingHotels,
  approveRejectHotel,
  getApprovedHotels,
  getApprovedHotelById,
} from "../controllers/hotelController.js";
import auth from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";

const router = express.Router();

// Validation rules for hotel registration
const hotelValidation = [
  body("name").notEmpty().withMessage("Hotel name is required"),
  body("address.street").notEmpty().withMessage("Street is required"),
  body("address.city").notEmpty().withMessage("City is required"),
  // ...add more validators as needed
];

// @route   POST /api/hotels
// @access  Private (hotel-owner only)
router.post(
  "/",
  auth, // ensure user is authenticated
  authorizeRoles("hotel-owner"), // only hotel-owner can proceed
  hotelValidation, // validate payload
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    registerHotel(req, res, next);
  }
);

// Admin: List pending hotels
router.get("/pending", auth, authorizeRoles("admin"), getPendingHotels);

// Admin: Approve/reject hotel
router.put(
  "/:id/approve",
  auth,
  authorizeRoles("admin"),
  body("status")
    .isIn(["approved", "rejected"])
    .withMessage('Status must be "approved" or "rejected"'),
  body("adminNotes").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    approveRejectHotel(req, res, next);
  }
);

// Public route: list approved hotels
router.get("/", getApprovedHotels);

// Public route: get approved hotel details by id
router.get("/:id", getApprovedHotelById);

export default router;
