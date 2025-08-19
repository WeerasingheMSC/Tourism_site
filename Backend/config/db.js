import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Simply pass the URI; modern Mongoose uses sensible defaults
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    // process.exit(1); // Commented out to allow server to start without DB
  }
};

export default connectDB;
