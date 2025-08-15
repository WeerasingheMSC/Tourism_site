import mongoose from 'mongoose';

const vehicleBookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'VB' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
  },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    driverLicense: { type: String, required: true },
    idNumber: { type: String, required: true }
  },
  vehicle: {
    vehicleId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Vehicle', 
      required: true 
    },
    name: { type: String, required: true },
    licensePlate: { type: String, required: true },
    category: { type: String, required: true }
  },
  booking: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    duration: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    pickupTime: { type: String, default: '09:00' },
    dropoffTime: { type: String, default: '18:00' },
    withDriver: { type: Boolean, default: false },
    driverInfo: {
      name: { type: String },
      phone: { type: String },
      licenseNumber: { type: String }
    }
  },
  pricing: {
    dailyRate: { type: Number, required: true },
    totalDays: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    driverCharge: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }
  },
  payment: {
    method: { 
      type: String, 
      enum: ['cash', 'card', 'bank_transfer', 'online'],
      default: 'cash'
    },
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'partial', 'refunded'],
      default: 'pending'
    },
    paidAmount: { type: Number, default: 0 },
    transactionId: { type: String },
    paymentDate: { type: Date }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String },
  cancellationReason: { type: String },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true
});

// Index for efficient queries
vehicleBookingSchema.index({ 'booking.startDate': 1, 'booking.endDate': 1 });
vehicleBookingSchema.index({ status: 1 });
vehicleBookingSchema.index({ 'customer.email': 1 });
vehicleBookingSchema.index({ bookingId: 1 });

// Calculate duration automatically
vehicleBookingSchema.pre('save', function(next) {
  if (this.booking.startDate && this.booking.endDate) {
    const start = new Date(this.booking.startDate);
    const end = new Date(this.booking.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.booking.duration = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    this.pricing.totalDays = diffDays;
  }
  next();
});

export default mongoose.model('VehicleBooking', vehicleBookingSchema);
