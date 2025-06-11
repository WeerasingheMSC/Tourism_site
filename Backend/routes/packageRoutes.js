// src/routes/packageRoutes.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  addPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage
} from '../controllers/packageController.js';
import auth from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = express.Router();

// Validation rules for creating a package
const packageValidation = [
  body('name').notEmpty().withMessage('Package name is required'),
  body('startingPrice').notEmpty().withMessage('Starting price is required'),
  body('idealFor')
    .isArray({ min: 1 })
    .withMessage('`idealFor` must be an array with at least one value'),
  body('packageIcon')
  .optional({ nullable: true, checkFalsy: true })
  .isURL({
    protocols: ['http','https'],
    require_protocol: true,
    require_valid_protocol: true,
    allow_underscores: true,
    require_tld: false
  })
  .withMessage('`packageIcon` must be a valid URL'),
,
  body('packagePhotos')
    .isArray()
    .withMessage('`packagePhotos` must be an array of URLs'),
  body('dailyPlans')
    .isArray({ min: 1 })
    .withMessage('`dailyPlans` must be an array with at least one day'),
  body('dailyPlans.*.day')
    .isInt({ min: 1 })
    .withMessage('Each daily plan must have a valid `day` number'),
  body('dailyPlans.*.title')
    .notEmpty()
    .withMessage('Each daily plan must have a `title`'),
  // you can add more nested validations for description, activities, locations...
  body('includedItems')
    .isArray()
    .withMessage('`includedItems` must be an array of strings'),
  body('notIncludedItems')
    .isArray()
    .withMessage('`notIncludedItems` must be an array of strings'),
];

// ---------------------------------------
// Public routes
// ---------------------------------------

// GET /api/packages
router.get('/', getPackages);

// GET /api/packages/:id
router.get('/:id', getPackageById);

// ---------------------------------------
// Admin-only routes
// ---------------------------------------

// POST /api/packages
router.post(
  '/',
  auth,
  authorizeRoles('admin'),
  packageValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    addPackage(req, res, next);
  }
);

// PUT /api/packages/:id
router.put(
  '/:id',
  auth,
  authorizeRoles('admin'),
  [
    body('name').optional().notEmpty().withMessage('Package name cannot be empty'),
    body('startingPrice').optional().notEmpty().withMessage('Starting price cannot be empty'),
    body('idealFor').optional().isArray().withMessage('`idealFor` must be an array'),
    body('packageIcon').optional().isURL().withMessage('`packageIcon` must be a valid URL'),
    body('packagePhotos').optional().isArray().withMessage('`packagePhotos` must be an array'),
    body('dailyPlans').optional().isArray().withMessage('`dailyPlans` must be an array'),
    body('includedItems').optional().isArray().withMessage('`includedItems` must be an array'),
    body('notIncludedItems').optional().isArray().withMessage('`notIncludedItems` must be an array'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    updatePackage(req, res, next);
  }
);

// DELETE /api/packages/:id
router.delete(
  '/:id',
  auth,
  authorizeRoles('admin'),
  deletePackage
);

export default router;
