import VehicleOwner from "../models/VehicleOwner.js";
import { validationResult } from "express-validator";

// Get vehicle owner profile
export const getVehicleOwnerProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const ownerProfile = await VehicleOwner.findOne({ userId });

    if (!ownerProfile) {
      return res.status(404).json({
        success: false,
        message: "Vehicle owner profile not found",
        profileExists: false,
      });
    }

    res.json({
      success: true,
      data: ownerProfile,
      profileExists: true,
    });
  } catch (error) {
    console.error("Get vehicle owner profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle owner profile",
      error: error.message,
    });
  }
};

// Create or update vehicle owner profile
export const createOrUpdateVehicleOwnerProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const {
      ownerName,
      businessName,
      email,
      phone,
      businessRegistrationNumber,
      nicNo,
      address,
      businessType,
      yearsOfExperience,
      preferences,
    } = req.body;

    // Check if profile already exists
    let ownerProfile = await VehicleOwner.findOne({ userId });

    const profileData = {
      userId,
      ownerName,
      businessName,
      email,
      phone,
      businessRegistrationNumber,
      nicNo,
      address,
      businessType,
      yearsOfExperience,
      preferences,
      profileCompleted: true,
      completedSteps: ["owner-details"], // Mark owner details as completed
    };

    if (ownerProfile) {
      // Update existing profile
      ownerProfile = await VehicleOwner.findOneAndUpdate(
        { userId },
        profileData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: "Vehicle owner profile updated successfully",
        data: ownerProfile,
      });
    } else {
      // Create new profile
      ownerProfile = new VehicleOwner(profileData);
      await ownerProfile.save();

      res.status(201).json({
        success: true,
        message: "Vehicle owner profile created successfully",
        data: ownerProfile,
      });
    }
  } catch (error) {
    console.error("Create/update vehicle owner profile error:", error);
    
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to save vehicle owner profile",
      error: error.message,
    });
  }
};

// Check if vehicle owner profile exists (used by dashboard)
export const checkVehicleOwnerProfileExists = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const ownerProfile = await VehicleOwner.findOne({ userId }).select('profileCompleted completedSteps');

    res.json({
      success: true,
      profileExists: !!ownerProfile,
      profileCompleted: ownerProfile?.profileCompleted || false,
      completedSteps: ownerProfile?.completedSteps || [],
    });
  } catch (error) {
    console.error("Check vehicle owner profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check vehicle owner profile",
      error: error.message,
    });
  }
};

// Update profile completion step
export const updateProfileStep = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { step, completed } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const ownerProfile = await VehicleOwner.findOne({ userId });
    
    if (!ownerProfile) {
      return res.status(404).json({
        success: false,
        message: "Vehicle owner profile not found",
      });
    }

    // Update completed steps
    if (completed && !ownerProfile.completedSteps.includes(step)) {
      ownerProfile.completedSteps.push(step);
    } else if (!completed) {
      ownerProfile.completedSteps = ownerProfile.completedSteps.filter(s => s !== step);
    }

    // Check if all steps are completed (only owner-details now)
    const allSteps = ["owner-details"];
    const allCompleted = allSteps.every(s => ownerProfile.completedSteps.includes(s));
    ownerProfile.profileCompleted = allCompleted;

    await ownerProfile.save();

    res.json({
      success: true,
      message: "Profile step updated successfully",
      data: {
        completedSteps: ownerProfile.completedSteps,
        profileCompleted: ownerProfile.profileCompleted,
      },
    });
  } catch (error) {
    console.error("Update profile step error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile step",
      error: error.message,
    });
  }
};

// Get vehicle owner details by user ID (for admin/public use)
export const getVehicleOwnerByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const ownerProfile = await VehicleOwner.findOne({ userId });

    if (!ownerProfile) {
      return res.status(404).json({
        success: false,
        message: "Vehicle owner profile not found",
      });
    }

    // Return only essential public information
    const publicOwnerData = {
      ownerName: ownerProfile.ownerName,
      businessName: ownerProfile.businessName,
      phone: ownerProfile.phone,
      email: ownerProfile.email,
    };

    res.json({
      success: true,
      data: publicOwnerData,
    });
  } catch (error) {
    console.error("Get vehicle owner by user ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle owner details",
      error: error.message,
    });
  }
};
