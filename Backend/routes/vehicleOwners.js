import express from "express";
import { body } from "express-validator";
import {
  getVehicleOwnerProfile,
  createOrUpdateVehicleOwnerProfile,
  checkVehicleOwnerProfileExists,
  updateProfileStep,
} from "../controllers/vehicleOwnerController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Validation rules for vehicle owner profile
const vehicleOwnerValidation = [
  body("ownerName").notEmpty().withMessage("Owner name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("nicNo").notEmpty().withMessage("NIC number is required"),
  body("businessName").optional().isString(),
  body("businessRegistrationNumber").optional().isString(),
  body("address.street").optional().isString(),
  body("address.city").optional().isString(),
  body("address.district").optional().isString(),
  body("address.postalCode").optional().isString(),
  body("businessType").optional().isIn(["individual", "company", "partnership"]),
  body("yearsOfExperience").optional().isInt({ min: 0 }),
];

// GET /api/vehicle-owners/profile - Get vehicle owner profile
router.get("/profile", auth, getVehicleOwnerProfile);

// POST /api/vehicle-owners/profile - Create or update vehicle owner profile
router.post("/profile", auth, vehicleOwnerValidation, createOrUpdateVehicleOwnerProfile);

// GET /api/vehicle-owners/profile/check - Check if profile exists
router.get("/profile/check", auth, checkVehicleOwnerProfileExists);

// PUT /api/vehicle-owners/profile/step - Update profile completion step
router.put("/profile/step", auth, 
  [
    body("step").isIn(["owner-details"]).withMessage("Invalid step"),
    body("completed").isBoolean().withMessage("Completed must be a boolean"),
  ],
  updateProfileStep
);

export default router;
