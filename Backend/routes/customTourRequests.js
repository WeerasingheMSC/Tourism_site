import express from 'express';
import { body, validationResult } from 'express-validator';

import { submitTourRequest, getAllRequests, approveRejectTourRequest } from '../controllers/customTourRequestController.js';
import auth from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

// Validation for custom tour request
const tourRequestValidation = [
  body('fullName').notEmpty().withMessage('Full Name is required'),
  body('email').isEmail().withMessage('Valid Email Address is required'),
  body('whatsappNumber').notEmpty().withMessage('WhatsApp Number is required'),
  body('numberOfAdults').isNumeric().withMessage('Number of Adults is required'),
  // Add other field validations here...
];

// Public: Tourists submit a custom tour request
router.post(
  '/requests',
  tourRequestValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    submitTourRequest(req, res, next);
  }
);

// Admin: View all pending tour requests
router.get(
  '/requests',
  auth,
  authorizeRoles('admin'),
  getAllRequests
);

// Admin: Approve or reject a custom tour request
router.put(
  '/requests/:id',
  auth,
  authorizeRoles('admin'),
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be "approved" or "rejected"'),
  body('adminNotes').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    approveRejectTourRequest(req, res, next);
  }
);

export default router;
