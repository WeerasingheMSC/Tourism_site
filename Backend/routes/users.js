import express from "express";
import { getMe } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// @route GET /api/users/me
// @access Private
router.get("/me", auth, getMe);

export default router;
