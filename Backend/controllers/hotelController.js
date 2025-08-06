import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";

/**
 * @desc    Register a new hotel (role must be "hotel-owner")
 * @route   POST /api/hotels
 * @access  Private (hotel-owner only)
 */
export const registerHotel = async (req, res, next) => {
  try {
    // ────────────────────────────────────────
    // ❶ Pull the owner’s ID straight from the JWT payload
    //    (populated by your `auth` middleware as `req.user.userId`)
    const ownerId = req.user.userId

    // ────────────────────────────────────────
    // ❷ Prevent duplicate registrations
    const already = await Hotel.findOne({ ownerId })
    if (already) {
      return res
        .status(400)
        .json({ message: "You have already registered a hotel." })
    }

    // ────────────────────────────────────────
    // ❸ Build your hotel object—`ownerId` is injected here,
    //    the rest comes from req.body, plus default pending status.
    const hotelData = {
      ownerId,
      ...req.body,
      approvalStatus: { status: "pending" },
    }

    // ────────────────────────────────────────
    // ❹ Persist to Mongo
    const hotel = await Hotel.create(hotelData)

    res.status(201).json({
      message: "Hotel registration submitted, pending admin approval",
      hotel,
    })
  } catch (err) {
    // handle the unique‐index violation gracefully
    if (err.code === 11000 && err.keyPattern?.ownerId) {
      return res
        .status(400)
        .json({ message: "You have already registered a hotel." })
    }
    next(err)
  }
}

/**
 * @desc    Get all hotels with pending approval status
 * @route   GET /api/hotels/pending
 * @access  Admin only
 */
export const getPendingHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ "approvalStatus.status": "pending" });
    res.json(hotels);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Admin approve or reject a hotel
 * @route   PUT /api/hotels/:id/approve
 * @access  Admin only
 * @body    { status: "approved" | "rejected", adminNotes: String (optional) }
 */
export const approveRejectHotel = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const { status, adminNotes } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: 'Status must be "approved" or "rejected"' });
    }

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    hotel.approvalStatus.status = status;
    hotel.approvalStatus.adminNotes = adminNotes || "";
    hotel.approvalStatus.reviewedAt = new Date();
    hotel.approvalStatus.reviewedBy = req.user.userId;

    await hotel.save();

    res.json({
      message: `Hotel ${status} successfully`,
      hotel,
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @desc    Get all hotels with approvalStatus.status = 'approved'
 * @route   GET /api/hotels
 * @access  Public
 */
export const getApprovedHotels = async (req, res, next) => {
  try {
    // Find all hotels that have been approved
    const hotels = await Hotel.find({
      "approvalStatus.status": "approved",
    }).select(
      "-approvalStatus.adminNotes -approvalStatus.reviewedBy -approvalStatus.reviewedAt -__v"
    );

    res.json(hotels);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get details of a single approved hotel by ID
 * @route   GET /api/hotels/:id
 * @access  Public
 */
export const getApprovedHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    // Find hotel by ID only if approved
    const hotel = await Hotel.findOne({
      _id: id,
      "approvalStatus.status": "approved",
    }).select(
      "-approvalStatus.adminNotes -approvalStatus.reviewedBy -approvalStatus.reviewedAt -__v"
    );

    if (!hotel) {
      return res
        .status(404)
        .json({ message: "Hotel not found or not approved yet" });
    }

    res.json(hotel);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Add a user review to a hotel
 * @route   POST /api/hotels/:id/reviews
 * @access  Private (any authenticated user)
 */
export const addReviewToHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hotel ID" });
    }

    const hotel = await Hotel.findById(id);
    if (!hotel || hotel.approvalStatus.status !== "approved") {
      return res
        .status(404)
        .json({ message: "Hotel not found or not approved" });
    }

    // push into the reviews array
    hotel.reviews.push({ user: userId, rating, comment });
    await hotel.save();

    res
      .status(201)
      .json({ message: "Review added", review: hotel.reviews.slice(-1)[0] });
  } catch (err) {
    next(err);
  }
};
