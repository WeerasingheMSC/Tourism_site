import mongoose from "mongoose";

const vehicleOwnerSchema = new mongoose.Schema(
  {
    // Link to user account
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One owner details per user
    },
    
    // Owner Information
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    businessRegistrationNumber: {
      type: String,
      trim: true,
    },
    nicNo: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Additional Contact Information
    address: {
      street: String,
      city: String,
      district: String,
      postalCode: String,
    },
    
    // Business Information
    businessType: {
      type: String,
      enum: ["individual", "company", "partnership"],
      default: "individual",
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
    },
    
    // Verification Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocuments: [{
      type: String, // URLs to uploaded documents
    }],
    
    // Profile Completion
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    completedSteps: [{
      type: String,
      enum: ["owner-details"],
    }],
    
    // Additional Settings
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
      },
      businessHours: {
        start: String,
        end: String,
        workingDays: [String],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
//vehicleOwnerSchema.index({ userId: 1 });
vehicleOwnerSchema.index({ email: 1 });
vehicleOwnerSchema.index({ phone: 1 });

const VehicleOwner = mongoose.model("VehicleOwner", vehicleOwnerSchema);

export default VehicleOwner;
