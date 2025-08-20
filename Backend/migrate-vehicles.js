import mongoose from 'mongoose';
import Vehicle from './models/Vehicle.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const updateVehicles = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check how many vehicles don't have approvalStatus
    const vehiclesWithoutStatus = await Vehicle.countDocuments({
      approvalStatus: { $exists: false }
    });
    console.log(`Found ${vehiclesWithoutStatus} vehicles without approval status`);

    if (vehiclesWithoutStatus > 0) {
      // Update vehicles that don't have approvalStatus
      const result = await Vehicle.updateMany(
        { approvalStatus: { $exists: false } },
        { 
          $set: { 
            approvalStatus: {
              status: 'pending',
              adminNotes: '',
              reviewedAt: null,
              reviewedBy: null
            }
          }
        }
      );
      console.log(`Updated ${result.modifiedCount} vehicles with default approval status`);
    }

    // Verify the update
    const allVehicles = await Vehicle.find({}).select('_id title approvalStatus');
    console.log('\nAll vehicles with approval status:');
    allVehicles.forEach(vehicle => {
      console.log(`- ${vehicle.title}: ${vehicle.approvalStatus?.status || 'undefined'}`);
    });

    console.log('\nMigration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

updateVehicles();
