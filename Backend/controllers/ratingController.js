import Rating from "../models/Rating.js";
import Vehicle from "../models/Vehicle.js";
import mongoose from "mongoose";

// Submit or update a rating
export const submitRating = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false,
        message: "Rating must be between 1 and 5" 
      });
    }

    // Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        message: "Vehicle not found" 
      });
    }

    // Update or create rating
    const existingRating = await Rating.findOneAndUpdate(
      { vehicleId, userId },
      { rating, review },
      { upsert: true, new: true }
    ).populate('userId', 'name');

    // Calculate new average rating for the vehicle
    await updateVehicleRating(vehicleId);

    res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      data: existingRating,
    });
  } catch (error) {
    console.error("Submit rating error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to submit rating",
      error: error.message 
    });
  }
};

// Get all ratings for a vehicle
export const getVehicleRatings = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const ratings = await Rating.find({ vehicleId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalRatings = await Rating.countDocuments({ vehicleId });

    // Calculate average rating
    const ratingStats = await Rating.aggregate([
      { $match: { vehicleId: new mongoose.Types.ObjectId(vehicleId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    const stats = ratingStats[0] || { averageRating: 0, totalRatings: 0 };

    res.status(200).json({
      success: true,
      data: {
        ratings,
        totalRatings,
        averageRating: Math.round(stats.averageRating * 10) / 10,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRatings / limit),
      }
    });
  } catch (error) {
    console.error("Get vehicle ratings error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to get vehicle ratings",
      error: error.message 
    });
  }
};

// Get user's rating for a specific vehicle
export const getUserRating = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findOne({ vehicleId, userId });

    res.status(200).json({ 
      success: true,
      data: { rating } 
    });
  } catch (error) {
    console.error("Get user rating error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to get user rating",
      error: error.message 
    });
  }
};

// Get vehicle rating summary (for vehicle cards)
export const getVehicleRatingSummary = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const ratingStats = await Rating.aggregate([
      { $match: { vehicleId: new mongoose.Types.ObjectId(vehicleId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    const stats = ratingStats[0] || { averageRating: 0, totalRatings: 0 };

    res.status(200).json({
      success: true,
      data: {
        averageRating: Math.round(stats.averageRating * 10) / 10,
        totalRatings: stats.totalRatings
      }
    });
  } catch (error) {
    console.error("Get vehicle rating summary error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to get vehicle rating summary",
      error: error.message 
    });
  }
};

// Helper function to update vehicle's average rating
const updateVehicleRating = async (vehicleId) => {
  try {
    const ratingStats = await Rating.aggregate([
      { $match: { vehicleId: new mongoose.Types.ObjectId(vehicleId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    const stats = ratingStats[0] || { averageRating: 0, totalRatings: 0 };

    await Vehicle.findByIdAndUpdate(vehicleId, {
      averageRating: Math.round(stats.averageRating * 10) / 10,
      totalRatings: stats.totalRatings,
    });
  } catch (error) {
    console.error("Update vehicle rating error:", error);
  }
};

// Delete a rating
export const deleteRating = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user.id;

    const deletedRating = await Rating.findOneAndDelete({ vehicleId, userId });

    if (!deletedRating) {
      return res.status(404).json({ 
        success: false,
        message: "Rating not found" 
      });
    }

    // Update vehicle's average rating
    await updateVehicleRating(vehicleId);

    res.status(200).json({ 
      success: true,
      message: "Rating deleted successfully" 
    });
  } catch (error) {
    console.error("Delete rating error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete rating",
      error: error.message 
    });
  }
};
