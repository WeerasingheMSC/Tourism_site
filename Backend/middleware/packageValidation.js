/**
 * Package validation middleware
 */

// Valid options for idealFor field
const VALID_IDEAL_FOR_OPTIONS = [
  'Young travelers', 'surfers', 'backpackers', 'Pilgrims', 'seniors', 
  'spiritual seekers', 'Firsttime visitors', 'groups', 'Families', 
  'couples', 'mixed-interest groups', 'photographers', 'Natural lovers',
  'beach lovers', 'solo travelers', 'local explorers', 'Honeymooners', 
  'special event', 'anniversary couples', 'students', 'History lovers'
];

// Valid status options
const VALID_STATUS_OPTIONS = ['draft', 'published', 'archived'];

/**
 * Validate package data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const validatePackage = (req, res, next) => {
  const errors = [];
  
  try {
    const {
      name,
      theme,
      description,
      idealFor,
      startingPrice,
      dailyPlans,
      includedItems,
      notIncludedItems,
      status
    } = req.body;

    // Parse JSON strings if they come as strings from FormData
    let parsedIdealFor, parsedDailyPlans, parsedIncludedItems, parsedNotIncludedItems;
    
    try {
      parsedIdealFor = typeof idealFor === 'string' ? JSON.parse(idealFor) : idealFor;
      parsedDailyPlans = typeof dailyPlans === 'string' ? JSON.parse(dailyPlans) : dailyPlans;
      parsedIncludedItems = typeof includedItems === 'string' ? JSON.parse(includedItems) : includedItems;
      parsedNotIncludedItems = typeof notIncludedItems === 'string' ? JSON.parse(notIncludedItems) : notIncludedItems;
    } catch (parseError) {
      errors.push('Invalid JSON format in request data');
    }

    // For POST requests, validate required fields
    if (req.method === 'POST') {
      // Required field validation
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('Package name is required and must be a non-empty string');
      }

      if (!theme || typeof theme !== 'string' || theme.trim().length === 0) {
        errors.push('Theme is required and must be a non-empty string');
      }

      if (!description || typeof description !== 'string' || description.trim().length === 0) {
        errors.push('Description is required and must be a non-empty string');
      }

      if (!parsedIdealFor || !Array.isArray(parsedIdealFor) || parsedIdealFor.length === 0) {
        errors.push('idealFor is required and must be a non-empty array');
      }

      if (!startingPrice) {
        errors.push('Starting price is required');
      }
    }

    // Field length validation
    if (name && name.length > 100) {
      errors.push('Package name cannot exceed 100 characters');
    }

    if (theme && theme.length > 50) {
      errors.push('Theme cannot exceed 50 characters');
    }

    if (description && description.length > 200) {
      errors.push('Description cannot exceed 200 characters');
    }

    // Starting price validation
    if (startingPrice !== undefined) {
      const price = parseFloat(startingPrice);
      if (isNaN(price) || price < 0) {
        errors.push('Starting price must be a valid positive number');
      }
    }

    // IdealFor validation
    if (parsedIdealFor) {
      if (!Array.isArray(parsedIdealFor)) {
        errors.push('idealFor must be an array');
      } else {
        if (parsedIdealFor.length > 4) {
          errors.push('Cannot select more than 4 ideal for options');
        }

        // Check if all values are valid
        const invalidOptions = parsedIdealFor.filter(option => !VALID_IDEAL_FOR_OPTIONS.includes(option));
        if (invalidOptions.length > 0) {
          errors.push(`Invalid ideal for options: ${invalidOptions.join(', ')}`);
        }
      }
    }

    // Status validation
    if (status && !VALID_STATUS_OPTIONS.includes(status)) {
      errors.push(`Status must be one of: ${VALID_STATUS_OPTIONS.join(', ')}`);
    }

    // Daily plans validation
    if (parsedDailyPlans) {
      if (!Array.isArray(parsedDailyPlans)) {
        errors.push('Daily plans must be an array');
      } else {
        parsedDailyPlans.forEach((plan, index) => {
          if (!plan.day || !Number.isInteger(plan.day) || plan.day < 1) {
            errors.push(`Daily plan ${index + 1}: day must be a positive integer`);
          }

          if (!plan.title || typeof plan.title !== 'string' || plan.title.trim().length === 0) {
            errors.push(`Daily plan ${index + 1}: title is required and must be a non-empty string`);
          }

          if (!plan.description || typeof plan.description !== 'string' || plan.description.trim().length === 0) {
            errors.push(`Daily plan ${index + 1}: description is required and must be a non-empty string`);
          }

          if (plan.activities && !Array.isArray(plan.activities)) {
            errors.push(`Daily plan ${index + 1}: activities must be an array`);
          }

          if (plan.locations && !Array.isArray(plan.locations)) {
            errors.push(`Daily plan ${index + 1}: locations must be an array`);
          }
        });

        // Check for duplicate days
        const days = parsedDailyPlans.map(plan => plan.day);
        const duplicateDays = days.filter((day, index) => days.indexOf(day) !== index);
        if (duplicateDays.length > 0) {
          errors.push(`Duplicate day numbers found: ${[...new Set(duplicateDays)].join(', ')}`);
        }
      }
    }

    // Included items validation
    if (parsedIncludedItems) {
      if (!Array.isArray(parsedIncludedItems)) {
        errors.push('Included items must be an array');
      } else {
        parsedIncludedItems.forEach((item, index) => {
          if (!item.text || typeof item.text !== 'string' || item.text.trim().length === 0) {
            errors.push(`Included item ${index + 1}: text is required and must be a non-empty string`);
          }
        });
      }
    }

    // Not included items validation
    if (parsedNotIncludedItems) {
      if (!Array.isArray(parsedNotIncludedItems)) {
        errors.push('Not included items must be an array');
      } else {
        parsedNotIncludedItems.forEach((item, index) => {
          if (!item.text || typeof item.text !== 'string' || item.text.trim().length === 0) {
            errors.push(`Not included item ${index + 1}: text is required and must be a non-empty string`);
          }
        });
      }
    }

    // File validation
    if (req.files) {
      // Package icon validation
      if (req.files.packageIcon && req.files.packageIcon.length > 0) {
        const iconFile = req.files.packageIcon[0];
        
        // Check file type for icon (should be PNG)
        if (!iconFile.mimetype.includes('png') && !iconFile.mimetype.includes('jpeg') && !iconFile.mimetype.includes('jpg')) {
          errors.push('Package icon must be a PNG, JPEG, or JPG image');
        }

        // Check file size for icon (5MB limit)
        if (iconFile.size > 5 * 1024 * 1024) {
          errors.push('Package icon must be smaller than 5MB');
        }
      }

      // Package photos validation
      if (req.files.packagePhotos && req.files.packagePhotos.length > 0) {
        if (req.files.packagePhotos.length > 30) {
          errors.push('Cannot upload more than 30 photos');
        }

        req.files.packagePhotos.forEach((photo, index) => {
          // Check file type
          if (!photo.mimetype.startsWith('image/')) {
            errors.push(`Photo ${index + 1}: must be an image file`);
          }

          // Check file size (10MB limit per photo)
          if (photo.size > 10 * 1024 * 1024) {
            errors.push(`Photo ${index + 1}: must be smaller than 10MB`);
          }
        });

        // Check total size of all photos (50MB limit)
        const totalPhotoSize = req.files.packagePhotos.reduce((sum, photo) => sum + photo.size, 0);
        if (totalPhotoSize > 50 * 1024 * 1024) {
          errors.push('Total size of all photos must be smaller than 50MB');
        }
      }
    }

    // For POST requests, require at least icon or photos
    if (req.method === 'POST') {
      const hasIcon = req.files?.packageIcon && req.files.packageIcon.length > 0;
      const hasPhotos = req.files?.packagePhotos && req.files.packagePhotos.length > 0;
      
      if (!hasIcon && !hasPhotos) {
        errors.push('At least one package icon or photo is required');
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Add parsed data back to request body for controller use
    if (parsedIdealFor) req.body.idealFor = parsedIdealFor;
    if (parsedDailyPlans) req.body.dailyPlans = parsedDailyPlans;
    if (parsedIncludedItems) req.body.includedItems = parsedIncludedItems;
    if (parsedNotIncludedItems) req.body.notIncludedItems = parsedNotIncludedItems;

    next();
  } catch (error) {
    console.error('Package validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Validation process failed',
      error: error.message
    });
  }
};

/**
 * Validate package ID parameter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const validatePackageId = (req, res, next) => {
  const { id } = req.params;
  
  // Check if ID is a valid MongoDB ObjectId
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid package ID format'
    });
  }
  
  next();
};

/**
 * Validate query parameters for package listing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const validatePackageQuery = (req, res, next) => {
  const errors = [];
  const {
    page,
    limit,
    minPrice,
    maxPrice,
    idealFor,
    status,
    sortBy,
    sortOrder
  } = req.query;

  // Validate pagination parameters
  if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.push('Page must be a positive integer');
  }

  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    errors.push('Limit must be a positive integer between 1 and 100');
  }

  // Validate price range
  if (minPrice && (isNaN(Number(minPrice)) || Number(minPrice) < 0)) {
    errors.push('minPrice must be a positive number');
  }

  if (maxPrice && (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)) {
    errors.push('maxPrice must be a positive number');
  }

  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    errors.push('minPrice cannot be greater than maxPrice');
  }

  // Validate idealFor filter
  if (idealFor) {
    const idealForArray = Array.isArray(idealFor) ? idealFor : [idealFor];
    const invalidOptions = idealForArray.filter(option => !VALID_IDEAL_FOR_OPTIONS.includes(option));
    if (invalidOptions.length > 0) {
      errors.push(`Invalid ideal for options: ${invalidOptions.join(', ')}`);
    }
  }

  // Validate status filter
  if (status && !VALID_STATUS_OPTIONS.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUS_OPTIONS.join(', ')}`);
  }

  // Validate sort parameters
  const validSortFields = ['name', 'theme', 'startingPrice', 'createdAt', 'updatedAt', 'views', 'bookings'];
  if (sortBy && !validSortFields.includes(sortBy)) {
    errors.push(`sortBy must be one of: ${validSortFields.join(', ')}`);
  }

  if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
    errors.push('sortOrder must be either "asc" or "desc"');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid query parameters',
      errors
    });
  }

  next();
};

export default {
  validatePackage,
  validatePackageId,
  validatePackageQuery
};