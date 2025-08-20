import express from "express";
import {
  submitRating,
  getVehicleRatings,
  getUserRating,
  getVehicleRatingSummary,
  deleteRating,
} from "../controllers/ratingController.js";
import { body } from "express-validator";
import auth from "../middleware/auth.js";

const router = express.Router();

// Submit or update a rating (requires authentication)
router.post(
  "/vehicle/:vehicleId",
  auth,
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Review must be less than 500 characters"),
  submitRating
);

// Get all ratings for a vehicle (public)
router.get("/vehicle/:vehicleId", getVehicleRatings);

// Get vehicle rating summary (public)
router.get("/vehicle/:vehicleId/summary", getVehicleRatingSummary);

// Get user's rating for a specific vehicle (requires authentication)
router.get("/vehicle/:vehicleId/user", auth, getUserRating);

// Delete user's rating (requires authentication)
router.delete("/vehicle/:vehicleId", auth, deleteRating);

export default router;
