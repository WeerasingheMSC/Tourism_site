import Vehicle from "../models/Vehicle.js";
import mongoose from "mongoose";

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
    const vehicles = await Vehicle.find({ "approvalStatus.status": "pending" });
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Admin approves or rejects a vehicle
 * @route   PUT /api/transports/:id/approve
 * @access  Admin only
 * @body    { status: "approved" | "rejected", adminNotes?: String }
 */
export const approveRejectVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    const { status, adminNotes } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be "approved" or "rejected"' });
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
