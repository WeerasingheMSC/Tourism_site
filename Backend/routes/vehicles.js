import express from "express";
import { body, validationResult } from "express-validator";

import {
  registerVehicle,
  getPendingVehicles,
  approveRejectVehicle,
  getApprovedVehicles,
  getApprovedVehicleById,
} from "../controllers/vehicleController.js";
import auth from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";

const router = express.Router();

// Validation rules (add more as needed)
const vehicleValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("vehicleType")
    .isIn(["car", "van", "bus", "minibus", "coach"])
    .withMessage("Invalid vehicle type"),
  // Add other validators for required fields if needed
];

// POST /api/vehicles
router.post(
  "/",
  auth,
  authorizeRoles("transport-owner"),
  vehicleValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    registerVehicle(req, res, next);
  }
);

// Admin: List all pending vehicles
router.get("/pending", auth, authorizeRoles("admin"), getPendingVehicles);

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

// Public route: list approved vehicles
router.get("/", getApprovedVehicles);

// Public route: get one approved vehicle by ID
router.get("/:id", getApprovedVehicleById);

export default router;
