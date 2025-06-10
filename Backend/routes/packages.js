import express from 'express';
import multer from 'multer';

// Import controllers
import {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  deletePackagePhoto,
  getPackageStats
} from '../controllers/packageController.js';

// Import validation middleware
import { 
  validatePackage, 
  validatePackageId, 
  validatePackageQuery 
} from '../middleware/packageValidation.js';

// Uncomment when auth is implemented
// import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 31 // 1 icon + 30 photos max
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      const error = new Error(`File type ${file.mimetype} is not supported. Please upload only image files.`);
      error.code = 'INVALID_FILE_TYPE';
      cb(error, false);
    }
  }
});

// File upload configuration for different fields
const uploadFields = upload.fields([
  { name: 'packageIcon', maxCount: 1 },
  { name: 'packagePhotos', maxCount: 30 }
]);

// Error handler for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 10MB per file.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 30 photos and 1 icon allowed.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected file field. Only packageIcon and packagePhotos are allowed.'
        });
      default:
        return res.status(400).json({
          success: false,
          message: `Upload error: ${error.message}`
        });
    }
  }
  
  if (error.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Validation middleware for package ID
const validateMongoId = (req, res, next) => {
  const { id, photoId } = req.params;
  
  // MongoDB ObjectId regex pattern
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  
  if (id && !objectIdPattern.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid package ID format'
    });
  }
  
  if (photoId && !objectIdPattern.test(photoId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid photo ID format'
    });
  }
  
  next();
};

// Routes - Order matters! More specific routes should come first

// Stats route - Must be before /:id to avoid conflicts
router.get('/stats', getPackageStats);

// Get all packages with optional query validation
router.get('/', validatePackageQuery, getPackages);

// Get single package by ID
router.get('/:id', validateMongoId, getPackage);

// Create new package (POST)
router.post('/', 
  uploadFields,
  handleMulterError,
  validatePackage,
  createPackage
);

// Update package (PUT)
router.put('/:id',
  validateMongoId,
  uploadFields,
  handleMulterError,
  validatePackage,
  updatePackage
);

// Delete package
router.delete('/:id', 
  validateMongoId,
  deletePackage
);

// Delete specific photo from package
router.delete('/:id/photos/:photoId', 
  validateMongoId,
  deletePackagePhoto
);

// Error handling middleware for this router
router.use((error, req, res, next) => {
  console.error('Package route error:', error);
  
  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.message
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  // Pass to global error handler
  next(error);
});

export default router;