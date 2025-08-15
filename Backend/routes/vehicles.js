import express from "express";
import { body, validationResult } from "express-validator";

import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  toggleVehicleAvailability,
  getVehicleStatistics,
  getAvailableVehicles,
  registerVehicle,
  getPendingVehicles,
  approveRejectVehicle,
  getApprovedVehicles,
  getApprovedVehicleById,
} from "../controllers/vehicleController.js";
import auth from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";

const router = express.Router();

// Validation rules for creating/updating vehicles
const vehicleValidation = [
  body("name").notEmpty().withMessage("Vehicle name is required"),
  body("licensePlate").notEmpty().withMessage("License plate is required"),
  body("category")
    .isIn(["car", "van", "bus", "minibus", "coach", "suv", "sedan"])
    .withMessage("Invalid vehicle category"),
  body("brand").notEmpty().withMessage("Brand is required"),
  body("model").notEmpty().withMessage("Model is required"),
  body("year").isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage("Valid year is required"),
  body("pricing.pricePerDay").isNumeric().withMessage("Price per day must be a number"),
  body("seatingCapacity").isInt({ min: 1 }).withMessage("Seating capacity must be a positive number"),
  // FAQs validation
  body("faqs").optional().isArray(),
  body("faqs.*.question").optional().isString().notEmpty(),
  body("faqs.*.answer").optional().isString().notEmpty(),
];

// Legacy validation for backward compatibility
const legacyVehicleValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("vehicleType")
    .isIn(["car", "van", "bus", "minibus", "coach"])
    .withMessage("Invalid vehicle type"),
];

// GET /api/vehicles - Get all vehicles with filtering (public access for general viewing)
router.get("/", getAllVehicles);

// GET /api/vehicles/my-vehicles - Get vehicles for current owner (protected)
router.get("/my-vehicles", auth, getAllVehicles);

// GET /api/vehicles/statistics - Get vehicle statistics
router.get("/statistics", auth, getVehicleStatistics);

// GET /api/vehicles/available - Get available vehicles for dates (public access)
router.get("/available", getAvailableVehicles);

// GET /api/vehicles/approved - Get approved vehicles (legacy)
router.get("/approved", getApprovedVehicles);

// GET /api/vehicles/pending - Get pending vehicles (admin only)
router.get("/pending", auth, authorizeRoles("admin"), getPendingVehicles);

// GET /api/vehicles/:id - Get single vehicle (public access for viewing)
router.get("/:id", getVehicleById);

// GET /api/vehicles/approved/:id - Get approved vehicle (legacy)
router.get("/approved/:id", getApprovedVehicleById);

// POST /api/vehicles - Create new vehicle
router.post("/", auth, vehicleValidation, createVehicle);

// POST /api/vehicles/register - Register vehicle (legacy)
router.post(
  "/register",
  auth,
  authorizeRoles("transport-owner"),
  legacyVehicleValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    registerVehicle(req, res, next);
  }
);

// PUT /api/vehicles/:id - Update vehicle
router.put("/:id", auth, vehicleValidation, updateVehicle);

// PATCH /api/vehicles/:id/availability - Toggle vehicle availability
router.patch("/:id/availability", auth, toggleVehicleAvailability);

// DELETE /api/vehicles/:id - Delete vehicle
router.delete("/:id", auth, deleteVehicle);

// Admin: Approve or reject vehicle
router.put(
  "/:id/approve",
  auth,
  authorizeRoles("admin"),
  body("status")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be approved or rejected"),
  body("adminNotes").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    approveRejectVehicle(req, res, next);
  }
);

export default router;
