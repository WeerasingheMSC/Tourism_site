import mongoose from 'mongoose';

const DailyPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  activities: [{
    type: String,
    trim: true
  }],
  locations: [{
    type: String,
    trim: true
  }]
});

const PackageItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  }
});

const PackageSchema = new mongoose.Schema({
  // Package Details
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true,
    maxlength: [100, 'Package name cannot exceed 100 characters']
  },
  theme: {
    type: String,
    required: [true, 'Theme is required'],
    trim: true,
    maxlength: [50, 'Theme cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  idealFor: [{
    type: String,
    required: true,
    enum: [
      'Young travelers', 'surfers', 'backpackers', 'Pilgrims', 'seniors', 
      'spiritual seekers', 'Firsttime visitors', 'groups', 'Families', 
      'couples', 'mixed-interest groups', 'photographers', 'Natural lovers',
      'beach lovers', 'solo travelers', 'local explorers', 'Honeymooners', 
      'special event', 'anniversary couples', 'students', 'History lovers'
    ]
  }],
  startingPrice: {
    type: Number,
    required: [true, 'Starting price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  // Images
  packageIcon: {
    fileName: {
      type: String,
      required: false
    },
    publicUrl: {
      type: String,
      required: false
    }
  },
  packagePhotos: [{
    fileName: {
      type: String,
      required: true
    },
    publicUrl: {
      type: String,
      required: true
    }
  }],
  
  // Daily Plans
  dailyPlans: [DailyPlanSchema],
  
  // Include/Not Include Items
  includedItems: [PackageItemSchema],
  notIncludedItems: [PackageItemSchema],
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make optional for now
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  bookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total days
PackageSchema.virtual('totalDays').get(function() {
  return this.dailyPlans.length;
});

// Virtual for price per day
PackageSchema.virtual('pricePerDay').get(function() {
  return this.totalDays > 0 ? (this.startingPrice / this.totalDays).toFixed(2) : this.startingPrice;
});

// Index for searching
PackageSchema.index({ name: 'text', theme: 'text', description: 'text' });
PackageSchema.index({ status: 1, isActive: 1 });
PackageSchema.index({ startingPrice: 1 });
PackageSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
PackageSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Validate idealFor array length
PackageSchema.pre('save', function(next) {
  if (this.idealFor && this.idealFor.length > 4) {
    next(new Error('Cannot select more than 4 ideal for options'));
  }
  next();
});

export default mongoose.model('Package', PackageSchema);