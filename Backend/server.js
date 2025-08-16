import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import errorHandler from "./middleware/errorHandler.js";
import hotelRoutes from "./routes/hotels.js";
import vehicleRoutes from "./routes/vehicles.js";
import vehicleBookingRoutes from "./routes/vehicleBookings.js";
import vehicleOwnerRoutes from "./routes/vehicleOwners.js";
import customTourRequestRoutes from "./routes/customTourRequests.js";
import packageRoutes from "./routes/packageRoutes.js";
import bookingRoutes from './routes/booking.js';
import hotelbookingRoutes from "./routes/hotelBooking.js";

dotenv.config(); // load .env
connectDB(); // connect to MongoDB

const app = express();

app.use(express.json()); // parse JSON
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
})); // enable CORS for frontend
app.use(morgan("dev")); // request logging

// mount our auth & user routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
//hotel routs
app.use("/api/hotels", hotelRoutes);
//vehicle routs
app.use("/api/vehicles", vehicleRoutes);
// Vehicle owner routes
app.use("/api/vehicle-owners", vehicleOwnerRoutes);
// Vehicle booking routes
app.use("/api/vehicle-bookings", vehicleBookingRoutes);
// Register routes for custom tour requests
app.use("/api/tours", customTourRequestRoutes);
// Mount under /api/packages
app.use("/api/packages", packageRoutes);
app.use('/api/bookings', bookingRoutes);
// Register the HotelBooking routes
app.use('/api/hotel-bookings',hotelbookingRoutes);

// global error handler (after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
