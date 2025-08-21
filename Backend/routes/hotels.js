import express from "express";
import { body, validationResult } from "express-validator";

import {
  registerHotel,
  getPendingHotels,
  approveRejectHotel,
  getApprovedHotels,
  getApprovedHotelById,
  addReviewToHotel,
  getAllHotels,
  getOwnerHotels,
  getOwnerHotelById
} from "../controllers/hotelController.js";
import auth from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";

const router = express.Router();

// extended validation rules for hotel registration
const hotelValidation = [
  body("name").notEmpty().withMessage("Hotel name is required"),
  body("address.street").notEmpty().withMessage("Street is required"),
  body("address.city").notEmpty().withMessage("City is required"),
  body("address.state").notEmpty().withMessage("State is required"),
  // new policies fields (optional)
  body("policies.childrenAndBeds").optional().isString(),
  body("policies.ageRestriction").optional().isString(),
  body("policies.petsAllowed").optional().isBoolean(),
  // FAQs
  body("faqs").optional().isArray(),
  body("faqs.*.question").optional().isString().notEmpty(),
  body("faqs.*.answer").optional().isString().notEmpty(),
];

// @route   POST /api/hotels
// @access  Private (hotel-owner only)
// register hotel
router.post(
  "/",
  auth,
  authorizeRoles("hotel-owner"),
  hotelValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
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
//  GET /api/hotels/owner  → hotel-owner only
router.get(
  "/owner",
  auth,
  authorizeRoles("hotel-owner"),
  getOwnerHotels
);

// in your hotelRoutes.js
router.get(
  '/all',
  auth,
  authorizeRoles('admin'),
  getAllHotels   // you’ll need to implement this in your controller
);
// Public route: list approved hotels
router.get("/", getApprovedHotels);

// Public route: get approved hotel details by id
router.get("/:id", getApprovedHotelById);

// ―――― new: submit a review ――――
router.post(
  "/:id/reviews",
  auth, // any logged‑in user
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating 1–5 required"),
  body("comment").optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    addReviewToHotel(req, res, next);
  }
);

router.get('/owner/:id', auth, getOwnerHotelById);


export default router;
