import Package from '../models/Package.js'; // Fixed: was 'Packege.js'
import { uploadFile, uploadMultipleFiles, deleteFile, deleteMultipleFiles, validateFile } from '../services/firebaseService.js';

/**
 * @desc    Get all packages
 * @route   GET /api/packages
 * @access  Public
 */
export const getPackages = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      theme,
      minPrice,
      maxPrice,
      idealFor,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query object
    const query = { isActive: true };

    // Add filters
    if (status) query.status = status;
    if (theme) query.theme = new RegExp(theme, 'i');
    if (idealFor) query.idealFor = { $in: Array.isArray(idealFor) ? idealFor : [idealFor] };
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = Number(minPrice);
      if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with population and pagination
    const packages = await Package.find(query)
      .select('-__v')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email')
      .lean();

    // Get total count for pagination
    const total = await Package.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      count: packages.length,
      pagination: {
        current: pageNum,
        pages: totalPages,
        total,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage
      },
      data: packages
    });
  } catch (error) {
    console.error('Get packages error:', error);
    next(error);
  }
};

/**
 * @desc    Get single package
 * @route   GET /api/packages/:id
 * @access  Public
 */
export const getPackage = async (req, res, next) => {
  try {
    const packageData = await Package.findById(req.params.id)
      .populate('createdBy', 'name email')
      .select('-__v');

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Increment view count
    await Package.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      data: packageData
    });
  } catch (error) {
    console.error('Get package error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    next(error);
  }
};

/**
 * @desc    Create new package
 * @route   POST /api/packages
 * @access  Private
 */
export const createPackage = async (req, res, next) => {
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
      status = 'draft'
    } = req.body;

    // Parse JSON strings if they come as strings from FormData
    const parsedIdealFor = typeof idealFor === 'string' ? JSON.parse(idealFor) : idealFor;
    const parsedDailyPlans = typeof dailyPlans === 'string' ? JSON.parse(dailyPlans) : dailyPlans || [];
    const parsedIncludedItems = typeof includedItems === 'string' ? JSON.parse(includedItems) : includedItems || [];
    const parsedNotIncludedItems = typeof notIncludedItems === 'string' ? JSON.parse(notIncludedItems) : notIncludedItems || [];

    // Validate required fields
    if (!name || !theme || !description || !parsedIdealFor || !startingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, theme, description, idealFor, startingPrice'
      });
    }

    // Validate idealFor array
    if (!Array.isArray(parsedIdealFor) || parsedIdealFor.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'idealFor must be a non-empty array'
      });
    }

    if (parsedIdealFor.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'Cannot select more than 4 ideal for options'
      });
    }

    // Validate starting price
    const price = parseFloat(startingPrice);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Starting price must be a valid positive number'
      });
    }

    // Handle file uploads
    let packageIconData = null;
    let packagePhotosData = [];

    try {
      // Upload package icon
      if (req.files?.packageIcon?.[0]) {
        const iconFile = req.files.packageIcon[0];
        
        // Validate icon file
        const iconValidation = validateFile(iconFile, {
          maxSize: 5 * 1024 * 1024, // 5MB for icon
          allowedTypes: ['image/png', 'image/jpeg', 'image/jpg']
        });

        if (!iconValidation.isValid) {
          return res.status(400).json({
            success: false,
            message: `Icon validation failed: ${iconValidation.errors.join(', ')}`
          });
        }

        console.log('📤 Uploading package icon...');
        const iconResult = await uploadFile(iconFile, 'package-icons');
        packageIconData = {
          fileName: iconResult.fileName,
          publicUrl: iconResult.publicUrl
        };
        console.log('✅ Package icon uploaded successfully');
      }

      // Upload package photos
      if (req.files?.packagePhotos && req.files.packagePhotos.length > 0) {
        console.log(`📤 Uploading ${req.files.packagePhotos.length} package photos...`);
        
        // Validate each photo
        for (const photo of req.files.packagePhotos) {
          const photoValidation = validateFile(photo, {
            maxSize: 10 * 1024 * 1024, // 10MB per photo
            allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
          });

          if (!photoValidation.isValid) {
            return res.status(400).json({
              success: false,
              message: `Photo validation failed for ${photo.originalname}: ${photoValidation.errors.join(', ')}`
            });
          }
        }

        const photoResults = await uploadMultipleFiles(req.files.packagePhotos, 'package-photos');
        packagePhotosData = photoResults.map(result => ({
          fileName: result.fileName,
          publicUrl: result.publicUrl
        }));
        console.log('✅ Package photos uploaded successfully');
      }

    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: `File upload failed: ${uploadError.message}`
      });
    }

    // Create package data
    const packageData = {
      name,
      theme,
      description,
      idealFor: parsedIdealFor,
      startingPrice: price,
      dailyPlans: parsedDailyPlans,
      includedItems: parsedIncludedItems,
      notIncludedItems: parsedNotIncludedItems,
      status,
      createdBy: req.user?.id || null // If user authentication is implemented
    };

    // Add file data if uploaded
    if (packageIconData) {
      packageData.packageIcon = packageIconData;
    }
    if (packagePhotosData.length > 0) {
      packageData.packagePhotos = packagePhotosData;
    }

    // Create package in database
    const newPackage = await Package.create(packageData);

    // Populate the created package
    const populatedPackage = await Package.findById(newPackage._id)
      .populate('createdBy', 'name email')
      .select('-__v');

    console.log('✅ Package created successfully:', newPackage._id);

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: populatedPackage
    });

  } catch (error) {
    console.error('Create package error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next(error);
  }
};

/**
 * @desc    Update package
 * @route   PUT /api/packages/:id
 * @access  Private
 */
export const updatePackage = async (req, res, next) => {
  try {
    const packageId = req.params.id;
    
    // Check if package exists
    const existingPackage = await Package.findById(packageId);
    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

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
    const updateData = {};
    
    if (name) updateData.name = name;
    if (theme) updateData.theme = theme;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    
    if (idealFor) {
      updateData.idealFor = typeof idealFor === 'string' ? JSON.parse(idealFor) : idealFor;
      
      // Validate idealFor
      if (updateData.idealFor.length > 4) {
        return res.status(400).json({
          success: false,
          message: 'Cannot select more than 4 ideal for options'
        });
      }
    }
    
    if (startingPrice) {
      const price = parseFloat(startingPrice);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Starting price must be a valid positive number'
        });
      }
      updateData.startingPrice = price;
    }
    
    if (dailyPlans) {
      updateData.dailyPlans = typeof dailyPlans === 'string' ? JSON.parse(dailyPlans) : dailyPlans;
    }
    
    if (includedItems) {
      updateData.includedItems = typeof includedItems === 'string' ? JSON.parse(includedItems) : includedItems;
    }
    
    if (notIncludedItems) {
      updateData.notIncludedItems = typeof notIncludedItems === 'string' ? JSON.parse(notIncludedItems) : notIncludedItems;
    }

    // Handle file uploads
    try {
      // Handle icon update
      if (req.files?.packageIcon?.[0]) {
        const iconFile = req.files.packageIcon[0];
        
        // Validate icon file
        const iconValidation = validateFile(iconFile, {
          maxSize: 5 * 1024 * 1024,
          allowedTypes: ['image/png', 'image/jpeg', 'image/jpg']
        });

        if (!iconValidation.isValid) {
          return res.status(400).json({
            success: false,
            message: `Icon validation failed: ${iconValidation.errors.join(', ')}`
          });
        }

        // Delete old icon if exists
        if (existingPackage.packageIcon?.fileName) {
          await deleteFile(existingPackage.packageIcon.fileName).catch(console.error);
        }

        // Upload new icon
        const iconResult = await uploadFile(iconFile, 'package-icons');
        updateData.packageIcon = {
          fileName: iconResult.fileName,
          publicUrl: iconResult.publicUrl
        };
      }

      // Handle photos update (append to existing photos)
      if (req.files?.packagePhotos && req.files.packagePhotos.length > 0) {
        // Validate each photo
        for (const photo of req.files.packagePhotos) {
          const photoValidation = validateFile(photo, {
            maxSize: 10 * 1024 * 1024,
            allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
          });

          if (!photoValidation.isValid) {
            return res.status(400).json({
              success: false,
              message: `Photo validation failed for ${photo.originalname}: ${photoValidation.errors.join(', ')}`
            });
          }
        }

        const photoResults = await uploadMultipleFiles(req.files.packagePhotos, 'package-photos');
        const newPhotos = photoResults.map(result => ({
          fileName: result.fileName,
          publicUrl: result.publicUrl
        }));

        // Append to existing photos
        updateData.packagePhotos = [...existingPackage.packagePhotos, ...newPhotos];
      }

    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: `File upload failed: ${uploadError.message}`
      });
    }

    // Update package
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('createdBy', 'name email')
      .select('-__v');

    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      data: updatedPackage
    });

  } catch (error) {
    console.error('Update package error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    next(error);
  }
};

/**
 * @desc    Delete package
 * @route   DELETE /api/packages/:id
 * @access  Private
 */
export const deletePackage = async (req, res, next) => {
  try {
    const packageData = await Package.findById(req.params.id);

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Collect all file names to delete
    const filesToDelete = [];
    
    if (packageData.packageIcon?.fileName) {
      filesToDelete.push(packageData.packageIcon.fileName);
    }
    
    if (packageData.packagePhotos && packageData.packagePhotos.length > 0) {
      packageData.packagePhotos.forEach(photo => {
        if (photo.fileName) {
          filesToDelete.push(photo.fileName);
        }
      });
    }

    // Delete files from Firebase Storage
    if (filesToDelete.length > 0) {
      try {
        console.log(`🗑️  Deleting ${filesToDelete.length} files from storage...`);
        await deleteMultipleFiles(filesToDelete);
        console.log('✅ Files deleted from storage');
      } catch (deleteError) {
        console.error('Error deleting files from storage:', deleteError);
        // Continue with package deletion even if file deletion fails
      }
    }

    // Delete package from database
    await Package.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });

  } catch (error) {
    console.error('Delete package error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    next(error);
  }
};

/**
 * @desc    Delete package photo
 * @route   DELETE /api/packages/:id/photos/:photoId
 * @access  Private
 */
export const deletePackagePhoto = async (req, res, next) => {
  try {
    const { id: packageId, photoId } = req.params;

    const packageData = await Package.findById(packageId);
    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Find the photo to delete
    const photoIndex = packageData.packagePhotos.findIndex(
      photo => photo._id.toString() === photoId
    );

    if (photoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    const photoToDelete = packageData.packagePhotos[photoIndex];

    // Delete file from Firebase Storage
    try {
      if (photoToDelete.fileName) {
        await deleteFile(photoToDelete.fileName);
        console.log(`✅ Photo deleted from storage: ${photoToDelete.fileName}`);
      }
    } catch (deleteError) {
      console.error('Error deleting photo from storage:', deleteError);
      // Continue with database deletion even if file deletion fails
    }

    // Remove photo from package
    packageData.packagePhotos.splice(photoIndex, 1);
    await packageData.save();

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully',
      data: packageData
    });

  } catch (error) {
    console.error('Delete package photo error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Package or photo not found'
      });
    }
    next(error);
  }
};

/**
 * @desc    Get package statistics
 * @route   GET /api/packages/stats
 * @access  Private
 */
export const getPackageStats = async (req, res, next) => {
  try {
    const stats = await Package.aggregate([
      {
        $group: {
          _id: null,
          totalPackages: { $sum: 1 },
          publishedPackages: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          },
          draftPackages: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          archivedPackages: {
            $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
          },
          averagePrice: { $avg: '$startingPrice' },
          totalViews: { $sum: '$views' },
          totalBookings: { $sum: '$bookings' }
        }
      }
    ]);

    const packagesByTheme = await Package.aggregate([
      { $group: { _id: '$theme', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentPackages = await Package.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name theme startingPrice status createdAt')
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalPackages: 0,
          publishedPackages: 0,
          draftPackages: 0,
          archivedPackages: 0,
          averagePrice: 0,
          totalViews: 0,
          totalBookings: 0
        },
        packagesByTheme,
        recentPackages
      }
    });

  } catch (error) {
    console.error('Get package stats error:', error);
    next(error);
  }
};