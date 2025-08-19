import VehicleBooking from '../models/VehicleBooking.js';
import Vehicle from '../models/Vehicle.js';
import { validationResult } from 'express-validator';

// Get all vehicle bookings with filtering and pagination
export const getAllVehicleBookings = async (req, res) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 10, 
      search, 
      startDate, 
      endDate,
      vehicleType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Check if this is a request for owner-specific bookings
    if (req.route.path === '/my-bookings' && req.user?.id) {
      console.log('🔍 VehicleBooking Debug - Owner request:', { userId: req.user.id, userRole: req.user.role });
      
      // First find all vehicles owned by this user
      const ownerVehicles = await Vehicle.find({ ownerId: req.user.id }).select('_id');
      const vehicleIds = ownerVehicles.map(v => v._id.toString());
      
      console.log('🔍 VehicleBooking Debug - Owner vehicles:', vehicleIds);
      
      // Filter bookings for these vehicles
      filter['vehicle.vehicleId'] = { $in: vehicleIds };
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'vehicle.name': { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startDate || endDate) {
      filter['booking.startDate'] = {};
      if (startDate) filter['booking.startDate'].$gte = new Date(startDate);
      if (endDate) filter['booking.startDate'].$lte = new Date(endDate);
    }
    
    if (vehicleType) {
      filter['vehicle.category'] = vehicleType;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const bookings = await VehicleBooking.find(filter)
      .populate('vehicle.vehicleId', 'name licensePlate category images')
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    console.log('🔍 VehicleBooking Debug - Found bookings:', bookings.length);
    console.log('🔍 VehicleBooking Debug - First booking customer:', bookings[0]?.customer);

    const total = await VehicleBooking.countDocuments(filter);

    // Get summary statistics
    const stats = await VehicleBooking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' }
        }
      }
    ]);

    const summary = {
      total,
      totalRevenue: stats.reduce((sum, stat) => sum + stat.totalRevenue, 0),
      statusCounts: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      summary
    });
  } catch (error) {
    console.error('Get vehicle bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicle bookings',
      error: error.message
    });
  }
};

// Get customer's own vehicle bookings (for tourists)
export const getCustomerVehicleBookings = async (req, res) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 10, 
      search, 
      startDate, 
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Get customer info from user token
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Get user details to find email
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const customerEmail = user.email;

    console.log('🔍 Customer VehicleBooking Debug - Customer request:', { 
      customerEmail, 
      userId: userId 
    });

    // Build filter object for customer's bookings
    const filter = {
      'customer.email': customerEmail
    };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { 'vehicle.name': { $regex: search, $options: 'i' } },
        { 'vehicle.licensePlate': { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startDate || endDate) {
      filter['booking.startDate'] = {};
      if (startDate) filter['booking.startDate'].$gte = new Date(startDate);
      if (endDate) filter['booking.startDate'].$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const bookings = await VehicleBooking.find(filter)
      .populate('vehicle.vehicleId', 'name licensePlate category images')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    console.log('🔍 Customer VehicleBooking Debug - Found bookings:', bookings.length);

    const total = await VehicleBooking.countDocuments(filter);

    // Get summary statistics for this customer
    const stats = await VehicleBooking.aggregate([
      { $match: { 'customer.email': customerEmail } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' }
        }
      }
    ]);

    const summary = {
      total,
      totalSpent: stats.reduce((sum, stat) => sum + stat.totalRevenue, 0),
      statusCounts: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      summary
    });
  } catch (error) {
    console.error('Get customer vehicle bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer vehicle bookings',
      error: error.message
    });
  }
};

// Get single vehicle booking
export const getVehicleBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await VehicleBooking.findById(id)
      .populate('vehicle.vehicleId')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get vehicle booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vehicle booking',
      error: error.message
    });
  }
};

// Create new vehicle booking
export const createVehicleBooking = async (req, res) => {
  try {
    console.log('📥 Received booking data:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      customer,
      vehicleId,
      booking,
      pricing,
      payment,
      notes
    } = req.body;

    // Check if vehicle exists and is available
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check vehicle availability for the requested dates
    const conflictingBookings = await VehicleBooking.find({
      'vehicle.vehicleId': vehicleId,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          'booking.startDate': {
            $lte: new Date(booking.endDate)
          },
          'booking.endDate': {
            $gte: new Date(booking.startDate)
          }
        }
      ]
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is not available for the selected dates'
      });
    }

    // Create booking
    const newBooking = new VehicleBooking({
      customer,
      vehicle: {
        vehicleId: vehicle._id,
        name: vehicle.name || vehicle.title,  // Handle both new and legacy field names
        licensePlate: vehicle.licensePlate || vehicle.registrationNumber,
        category: vehicle.category || vehicle.vehicleType
      },
      booking,
      pricing,
      payment,
      notes,
      createdBy: req.user?.id
    });

    await newBooking.save();

    // Populate the created booking
    await newBooking.populate('vehicle.vehicleId');

    res.status(201).json({
      success: true,
      message: 'Vehicle booking created successfully',
      data: newBooking
    });
  } catch (error) {
    console.error('Create vehicle booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create vehicle booking',
      error: error.message
    });
  }
};

// Update vehicle booking
export const updateVehicleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const booking = await VehicleBooking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle booking not found'
      });
    }

    // Add updatedBy field
    updateData.updatedBy = req.user?.id;

    const updatedBooking = await VehicleBooking.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('vehicle.vehicleId');

    res.json({
      success: true,
      message: 'Vehicle booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Update vehicle booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle booking',
      error: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    console.log('🔄 Backend - UpdateBookingStatus called with:', {
      params: req.params,
      body: req.body,
      user: req.user,
      userId: req.user?.id || req.user?.userId
    });

    const { id } = req.params;
    const { status, adminStatus, ownerStatus, cancellationReason } = req.body;

    const booking = await VehicleBooking.findById(id);
    if (!booking) {
      console.log('❌ Backend - Booking not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Vehicle booking not found'
      });
    }

    console.log('✅ Backend - Booking found, current statuses:', {
      status: booking.status,
      adminStatus: booking.adminStatus,
      ownerStatus: booking.ownerStatus
    });

    const updateData = { 
      updatedBy: req.user?.id || req.user?.userId
    };

    // Update specific status fields based on what's provided
    if (status) updateData.status = status;
    if (adminStatus) updateData.adminStatus = adminStatus;
    if (ownerStatus) updateData.ownerStatus = ownerStatus;

    if (status === 'cancelled' && cancellationReason) {
      updateData.cancellationReason = cancellationReason;
    }

    const updatedBooking = await VehicleBooking.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    console.log('✅ Backend - Booking updated successfully:', {
      id: updatedBooking._id,
      status: updatedBooking.status,
      adminStatus: updatedBooking.adminStatus,
      ownerStatus: updatedBooking.ownerStatus
    });

    // Check if both admin and owner have approved to send email
    if (((updatedBooking.status === 'approved' || updatedBooking.status === 'confirmed') && 
         updatedBooking.ownerStatus === 'confirmed')) {
      try {
        await sendBookingApprovalEmail(updatedBooking);
        console.log('✅ Approval email sent to customer');
      } catch (emailError) {
        console.error('❌ Failed to send approval email:', emailError);
      }
    }

    res.json({
      success: true,
      message: `Booking updated successfully`,
      data: updatedBooking
    });
  } catch (error) {
    console.error('❌ Backend - Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

// Send booking approval email to customer
const sendBookingApprovalEmail = async (booking) => {
  const { sendEmail } = await import('../services/emailService.js');
  
  const subject = `Vehicle Booking Approved - ${booking.bookingId}`;
  const emailText = `
Dear ${booking.customer.name},

Great news! Your vehicle booking has been approved and is ready for your trip.

Booking Details:
- Booking ID: ${booking.bookingId}
- Vehicle: ${booking.vehicle.name}
- Pickup: ${booking.booking.pickupLocation}
- Drop-off: ${booking.booking.dropoffLocation}
- Start Date: ${new Date(booking.booking.startDate).toLocaleDateString()}
- End Date: ${new Date(booking.booking.endDate).toLocaleDateString()}
- Total Amount: $${booking.pricing.totalAmount}

Your booking is now confirmed. Please prepare for your upcoming trip!

Best regards,
Tourism Platform Team
  `;

  await sendEmail(booking.customer.email, subject, emailText);
};

// Delete vehicle booking
export const deleteVehicleBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await VehicleBooking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle booking not found'
      });
    }

    // Only allow deletion if booking is pending or cancelled
    if (!['pending', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active or completed bookings'
      });
    }

    await VehicleBooking.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Vehicle booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete vehicle booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vehicle booking',
      error: error.message
    });
  }
};

// Get booking statistics
export const getBookingStatistics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.setDate(now.getDate() - 7))
          }
        };
        break;
      case 'month':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.setMonth(now.getMonth() - 1))
          }
        };
        break;
      case 'year':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.setFullYear(now.getFullYear() - 1))
          }
        };
        break;
    }

    // Get various statistics
    const stats = await VehicleBooking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' },
          averageBookingValue: { $avg: '$pricing.totalAmount' },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          activeBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get popular vehicles
    const popularVehicles = await VehicleBooking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$vehicle.vehicleId',
          vehicleName: { $first: '$vehicle.name' },
          bookingCount: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' }
        }
      },
      { $sort: { bookingCount: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalBookings: 0,
          totalRevenue: 0,
          averageBookingValue: 0,
          confirmedBookings: 0,
          activeBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0
        },
        popularVehicles
      }
    });
  } catch (error) {
    console.error('Get booking statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking statistics',
      error: error.message
    });
  }
};
