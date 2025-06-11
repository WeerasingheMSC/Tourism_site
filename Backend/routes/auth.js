import express from "express";
import { body, validationResult } from "express-validator";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Validation rules for registration
const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be ≥6 chars"),
];

// @route POST /api/auth/register
router.post("/register", registerValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // send array of validation errors
    return res.status(400).json({ errors: errors.array() });
  }
  register(req, res, next);
});

// Validation rules for login
const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").exists().withMessage("Password is required"),
];

// @route POST /api/auth/login
router.post("/login", loginValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  login(req, res, next);
});

// POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("Valid email required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    forgotPassword(req, res, next);
  }
);

// POST /api/auth/reset-password
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be ≥6 chars"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    resetPassword(req, res, next);
  }
);

router.post(
  '/google',
  body('idToken').notEmpty().withMessage('idToken is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    googleSignIn(req, res, next);
  }
);

export default router;
