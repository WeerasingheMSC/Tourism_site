import Vehicle from "../models/Vehicle.js";
import VehicleBooking from '../models/VehicleBooking.js';
import VehicleOwner from '../models/VehicleOwner.js';
import mongoose from "mongoose";
import { validationResult } from 'express-validator';

// Get all vehicles with filtering and pagination
export const getAllVehicles = async (req, res) => {
  try {
    const { 
      category, 
      available, 
      page = 1, 
      limit = 10, 
      search,
      sortBy = 'name',
      sortOrder = 'asc',
      location,
      priceRange
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Check if this is a request for owner-specific vehicles
    if (req.route.path === '/my-vehicles' && req.user?.id) {
      filter.ownerId = req.user.id;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (available !== undefined) {
      filter.available = available === 'true';
    }

    if (location) {
      filter['location.city'] = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { licensePlate: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      filter['pricing.pricePerDay'] = {};
      if (minPrice) filter['pricing.pricePerDay'].$gte = minPrice;
      if (maxPrice) filter['pricing.pricePerDay'].$lte = maxPrice;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const vehicles = await Vehicle.find(filter)
      .populate('ownerId', 'name email phone businessName personalInfo contactInfo')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vehicle.countDocuments(filter);

    // Get category statistics
    const categoryStats = await Vehicle.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$pricing.pricePerDay' }
        }
      }
    ]);

    res.json({
      success: true,
      data: vehicles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      categoryStats
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicles',
      error: error.message
    });
  }
};

// Get single vehicle with availability check
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    let isAvailable = vehicle.available;
    let conflictingBookings = [];

    // Check availability for specific dates if provided
    if (startDate && endDate) {
      conflictingBookings = await VehicleBooking.find({
        'vehicle.vehicleId': id,
        status: { $in: ['confirmed', 'active'] },
        $or: [
          {
            'booking.startDate': {
              $lte: new Date(endDate)
            },
            'booking.endDate': {
              $gte: new Date(startDate)
            }
          }
        ]
      });

      isAvailable = conflictingBookings.length === 0;
    }

    // Get recent reviews/ratings for this vehicle
    const recentBookings = await VehicleBooking.find({
      'vehicle.vehicleId': id,
      status: 'completed',
      rating: { $exists: true }
    })
    .sort({ updatedAt: -1 })
    .limit(5)
    .select('rating review customer.name updatedAt');

    // Get owner details if ownerId exists
    let ownerDetails = null;
    if (vehicle.ownerId) {
      ownerDetails = await VehicleOwner.findOne({ userId: vehicle.ownerId })
        .select('ownerName businessName email phone');
    }

    res.json({
      success: true,
      data: {
        ...vehicle.toObject(),
        isAvailable,
        conflictingDates: conflictingBookings.map(booking => ({
          startDate: booking.booking.startDate,
          endDate: booking.booking.endDate
        })),
        recentReviews: recentBookings,
        ownerDetails: ownerDetails
      }
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicle',
      error: error.message
    });
  }
};

// Create new vehicle
export const createVehicle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if license plate already exists
    const existingVehicle = await Vehicle.findOne({ 
      registrationNumber: req.body.licensePlate 
    });
    
    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle with this license plate already exists'
      });
    }

    // Map modern API fields to legacy model fields
    const vehicleData = {
      title: req.body.name,
      description: req.body.description,
      vehicleType: req.body.category,
      make: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      registrationNumber: req.body.licensePlate,
      seatCapacity: req.body.seatingCapacity,
      transmission: req.body.transmission,
      fuelType: req.body.fuelType,
      color: req.body.color,
      mileage: req.body.mileage,
      airConditioning: req.body.airConditioning || false,
      location: req.body.location || {},
      available: req.body.available !== undefined ? req.body.available : true,
      features: req.body.features || [],
      images: req.body.images || [],
      faqs: req.body.faqs || [],
      price: {
        perDay: req.body.pricing?.pricePerDay || 0,
        perHour: req.body.pricing?.pricePerHour || 0
      },
      pickupLocations: req.body.pickupLocations || [],
      policies: req.body.policies || {
        cancellation: "Free cancellation up to 24 hours before pickup",
        fuelPolicy: "Full-to-full",
        mileageLimit: "200 km/day"
      },
      ownerId: req.user?.id
    };

    const newVehicle = new Vehicle(vehicleData);

    await newVehicle.save();

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: newVehicle
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create vehicle',
      error: error.message
    });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if user owns this vehicle (unless admin)
    if (req.user?.role !== 'admin' && vehicle.ownerId && vehicle.ownerId.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own vehicles.'
      });
    }

    // Check if license plate is being changed and if it conflicts
    if (updateData.licensePlate && updateData.licensePlate !== vehicle.licensePlate) {
      const existingVehicle = await Vehicle.findOne({ 
        licensePlate: updateData.licensePlate,
        _id: { $ne: id }
      });
      
      if (existingVehicle) {
        return res.status(400).json({
          success: false,
          message: 'Vehicle with this license plate already exists'
        });
      }
    }

    updateData.updatedBy = req.user?.id;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: updatedVehicle
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle',
      error: error.message
    });
  }
};

// Toggle vehicle availability
export const toggleVehicleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { available, reason } = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    const updateData = { 
      available,
      updatedBy: req.user?.id
    };

    if (!available && reason) {
      updateData.unavailabilityReason = reason;
    } else if (available) {
      updateData.$unset = { unavailabilityReason: 1 };
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: `Vehicle ${available ? 'enabled' : 'disabled'} successfully`,
      data: updatedVehicle
    });
  } catch (error) {
    console.error('Toggle vehicle availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle availability',
      error: error.message
    });
  }
};

/**
 * @desc    Register a new vehicle (role must be "transport-owner")
 * @route   POST /api/vehicles
 * @access  Private (transport-owner only)
 */
export const registerVehicle = async (req, res, next) => {
  try {
    const ownerId = req.user.userId; // from auth middleware

    const vehicleData = {
      ownerId,
      ...req.body,
      approvalStatus: { status: "pending" },
    };

    const vehicle = await Vehicle.create(vehicleData);

    res.status(201).json({
      message: "Vehicle registration submitted, pending admin approval",
      vehicle,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all vehicles pending approval
 * @route   GET /api/transports/pending
 * @access  Admin only
 */
export const getPendingVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ "approvalStatus.status": "pending" })
      .populate('ownerId', 'name email phone businessName personalInfo contactInfo')
      .sort({ createdAt: -1 }); // Latest first
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all vehicles for admin management
 * @route   GET /api/vehicles/admin/all
 * @access  Admin only
 */
export const getAllVehiclesForAdmin = async (req, res, next) => {
  try {
    // Get all vehicles with owner details populated
    const vehicles = await Vehicle.find({})
      .populate('ownerId', 'name email phone businessName personalInfo contactInfo')
      .sort({ createdAt: -1 }); // Latest first
    
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Admin approves or rejects a vehicle
 * @route   PUT /api/transports/:id/approve
 * @access  Admin only
 * @body    { status: "pending" | "approved" | "rejected", adminNotes?: String }
 */
export const approveRejectVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    const { status, adminNotes } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be "pending", "approved" or "rejected"' });
    }

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicle.approvalStatus.status = status;
    vehicle.approvalStatus.adminNotes = adminNotes || "";
    vehicle.approvalStatus.reviewedAt = new Date();
    vehicle.approvalStatus.reviewedBy = req.user.userId;

    await vehicle.save();

    res.json({
      message: `Vehicle ${status} successfully`,
      vehicle,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all approved vehicles
 * @route   GET /api/vehicles
 * @access  Public
 */
export const getApprovedVehicles = async (req, res, next) => {
  try {
    // Find all vehicles where approvalStatus.status is 'approved'
    const vehicles = await Vehicle.find({
      "approvalStatus.status": "approved",
    }).select(
      "-approvalStatus.adminNotes -approvalStatus.reviewedBy -approvalStatus.reviewedAt -__v"
    );

    res.json(vehicles);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get details of one approved vehicle by ID
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
export const getApprovedVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    // Find the vehicle only if it is approved
    const vehicle = await Vehicle.findOne({
      _id: id,
      "approvalStatus.status": "approved",
    }).select(
      "-approvalStatus.adminNotes -approvalStatus.reviewedBy -approvalStatus.reviewedAt -__v"
    );

    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found or not approved yet" });
    }

    res.json(vehicle);
  } catch (err) {
    next(err);
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if user owns this vehicle (unless admin)
    if (req.user?.role !== 'admin' && vehicle.ownerId && vehicle.ownerId.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own vehicles.'
      });
    }

    // Check if vehicle has active bookings
    const activeBookings = await VehicleBooking.find({
      'vehicle.vehicleId': id,
      status: { $in: ['confirmed', 'active'] }
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete vehicle with active bookings'
      });
    }

    await Vehicle.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vehicle',
      error: error.message
    });
  }
};

// Get vehicle statistics
export const getVehicleStatistics = async (req, res) => {
  try {
    // Get overall vehicle statistics
    const totalVehicles = await Vehicle.countDocuments();
    const availableVehicles = await Vehicle.countDocuments({ available: true });
    
    // Get vehicles by category
    const vehiclesByCategory = await Vehicle.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$available', true] }, 1, 0] }
          },
          averagePrice: { $avg: '$pricing.pricePerDay' }
        }
      }
    ]);

    // Get most popular vehicles (by booking count)
    const popularVehicles = await VehicleBooking.aggregate([
      {
        $group: {
          _id: '$vehicle.vehicleId',
          vehicleName: { $first: '$vehicle.name' },
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 10 }
    ]);

    // Get revenue by vehicle category
    const revenueByCategory = await VehicleBooking.aggregate([
      {
        $group: {
          _id: '$vehicle.category',
          totalRevenue: { $sum: '$pricing.totalAmount' },
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalVehicles,
          availableVehicles,
          unavailableVehicles: totalVehicles - availableVehicles,
          utilizationRate: totalVehicles > 0 ? ((totalVehicles - availableVehicles) / totalVehicles * 100).toFixed(2) : 0
        },
        vehiclesByCategory,
        popularVehicles,
        revenueByCategory
      }
    });
  } catch (error) {
    console.error('Get vehicle statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicle statistics',
      error: error.message
    });
  }
};

// Get available vehicles for specific dates
export const getAvailableVehicles = async (req, res) => {
  try {
    const { startDate, endDate, category, location } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    // Build filter for vehicles
    const vehicleFilter = { available: true };
    if (category) vehicleFilter.category = category;
    if (location) vehicleFilter['location.city'] = { $regex: location, $options: 'i' };

    // Get all vehicles matching criteria
    const vehicles = await Vehicle.find(vehicleFilter);

    // Get conflicting bookings for the date range
    const conflictingBookings = await VehicleBooking.find({
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          'booking.startDate': {
            $lte: new Date(endDate)
          },
          'booking.endDate': {
            $gte: new Date(startDate)
          }
        }
      ]
    }).select('vehicle.vehicleId');

    const conflictingVehicleIds = conflictingBookings.map(booking => 
      booking.vehicle.vehicleId.toString()
    );

    // Filter out vehicles with conflicts
    const availableVehicles = vehicles.filter(vehicle => 
      !conflictingVehicleIds.includes(vehicle._id.toString())
    );

    res.json({
      success: true,
      data: availableVehicles,
      count: availableVehicles.length
    });
  } catch (error) {
    console.error('Get available vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available vehicles',
      error: error.message
    });
  }
};
