import VehicleBooking from '../models/VehicleBooking.js';

// Migration to update existing bookings with rental type data
export const updateBookingsWithRentalType = async (req, res) => {
  try {
    console.log('🔄 Starting migration to update bookings with rental type...');
    
    // Find all bookings that don't have rental type set
    const bookingsToUpdate = await VehicleBooking.find({
      $or: [
        { 'pricing.rentalType': { $exists: false } },
        { 'pricing.rentalType': null },
        { 'pricing.rentalType': '' }
      ]
    });

    console.log(`📊 Found ${bookingsToUpdate.length} bookings to update`);

    let updatedCount = 0;

    for (const booking of bookingsToUpdate) {
      // Set default rental type to 'daily' for existing bookings
      const updateData = {
        'pricing.rentalType': 'daily'
      };

      // Enhanced logic to detect rental type from existing data patterns
      const pricing = booking.pricing || {};
      
      // Check unit field first
      if (pricing.unit === 'hour' || pricing.unit === 'hours') {
        updateData['pricing.rentalType'] = 'hourly';
      } else if (pricing.unit === 'km' || pricing.unit === 'kilometer') {
        updateData['pricing.rentalType'] = 'kilometer';
      }
      
      // Check for hour-related fields
      else if (pricing.estimatedHours || pricing.totalHours || pricing.hourlyRate) {
        updateData['pricing.rentalType'] = 'hourly';
      }
      
      // Check for kilometer-related fields  
      else if (pricing.estimatedKilometers || pricing.totalKilometers || pricing.distance || pricing.perKmRate) {
        updateData['pricing.rentalType'] = 'kilometer';
      }
      
      // Check price patterns - if base price is very low, likely per hour or per km
      else if (pricing.basePrice && pricing.basePrice < 50) {
        // Low base price suggests hourly or per-km rental
        if (booking.booking && booking.booking.duration && parseFloat(booking.booking.duration) > 24) {
          updateData['pricing.rentalType'] = 'kilometer'; // Long duration with low price = per km
        } else {
          updateData['pricing.rentalType'] = 'hourly'; // Short duration with low price = per hour
        }
      }

      console.log(`📝 Updating booking ${booking.bookingId || booking._id}: ${updateData['pricing.rentalType']}`);
      await VehicleBooking.findByIdAndUpdate(booking._id, updateData);
      updatedCount++;
    }

    console.log(`✅ Updated ${updatedCount} bookings with rental type data`);

    res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} bookings with rental type data`,
      updated: updatedCount,
      total: bookingsToUpdate.length
    });

  } catch (error) {
    console.error('❌ Migration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bookings with rental type',
      error: error.message
    });
  }
};

// Get booking data structure for debugging
export const getBookingDataStructure = async (req, res) => {
  try {
    const sampleBookings = await VehicleBooking.find({}).limit(5).lean();
    
    res.status(200).json({
      success: true,
      message: 'Sample booking data structure',
      data: sampleBookings.map(booking => ({
        bookingId: booking.bookingId,
        pricing: booking.pricing,
        createdAt: booking.createdAt
      }))
    });
  } catch (error) {
    console.error('❌ Error getting booking data structure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking data structure',
      error: error.message
    });
  }
};
