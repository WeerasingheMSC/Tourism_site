import axios, { AxiosError } from "axios";

//const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

// Type definitions
export interface VehicleBooking {
  _id: string;
  bookingId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    driverLicense?: string; // Made optional to match backend validation
    idNumber?: string; // Made optional to match backend validation
  };
  vehicle: {
    vehicleId: string;
    name: string;
    licensePlate: string;
    category: string;
  };
  booking: {
    startDate: Date | string;
    endDate: Date | string;
    duration: string | number; // Can be string or number
    pickupLocation: string;
    dropoffLocation: string;
    pickupTime?: string;
    dropoffTime?: string;
    withDriver?: boolean;
    driverRequired?: boolean; // Added for backend compatibility
  };
  pricing: {
    basePrice: number; // Required by backend validation
    dailyRate?: number;
    totalDays?: number;
    subtotal?: number;
    driverCharge?: number;
    insurance?: number;
    tax?: number;
    discount?: number;
    totalAmount: number; // Required by backend validation
  };
  payment: {
    method: "cash" | "card" | "bank_transfer" | "online";
    status: "pending" | "partial" | "paid" | "refunded";
    advanceAmount?: number;
    remainingAmount?: number;
    transactionId?: string;
  };
  status:
    | "pending"
    | "confirmed"
    | "active"
    | "completed"
    | "cancelled"
    | "approved";
  adminStatus?: "pending" | "completed";
  ownerStatus?: "pending" | "confirmed";
  notes?: string;
  rating?: number;
  review?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  _id: string;
  // Modern API fields
  name?: string;
  licensePlate?: string;
  category?: string;
  brand?: string;
  // Legacy model fields
  title?: string;
  registrationNumber?: string;
  vehicleType?: string;
  make?: string;
  // Common fields
  model: string;
  year: number;
  seatingCapacity?: number;
  seatCapacity?: number;
  fuelType: string;
  transmission: string;
  features: string[];
  images: string[];
  // Modern pricing structure
  pricing?: {
    pricePerDay: number;
    pricePerHour?: number;
    pricePerKilometer?: number;
    pricePerKm?: number;
    driverFee?: number;
  };
  // Legacy pricing structure
  price?: {
    perDay: number;
    perHour?: number;
    perKilometer?: number;
  };
  location?: {
    city: string;
    area: string;
    address?: string;
    coordinates?: [number, number];
  };
  // Additional fields for complete vehicle information
  color?: string;
  mileage?: number;
  airConditioning?: boolean;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  available?: boolean;
  unavailabilityReason?: string;
  description?: string;
  // Rating fields
  averageRating?: number;
  totalRatings?: number;
  createdAt: Date;
  updatedAt: Date;
  // Owner details
  ownerDetails?: {
    ownerName: string;
    businessName?: string;
    email: string;
    phone: string;
  };
  // Approval status
  approvalStatus?: {
    status: "pending" | "approved" | "rejected";
    adminNotes?: string;
    reviewedAt?: Date;
    reviewedBy?: string;
  };
}

export interface BookingFilters {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  vehicleType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface VehicleFilters {
  category?: string;
  available?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  priceRange?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Create axios instance with default config
const vehicleBookingAPI = axios.create({
  baseURL: `${API_BASE_URL}/vehicle-bookings`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
vehicleBookingAPI.interceptors.request.use((config) => {
  // First try to get the main auth token
  let token = localStorage.getItem("authToken");

  // If no main token, try to get customer token or any other token
  if (!token) {
    token = localStorage.getItem("token"); // fallback token name
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Vehicle Booking API functions
export const vehicleBookingService = {
  // Get all vehicle bookings with filtering
  getAllBookings: async (params: BookingFilters = {}) => {
    try {
      const response = await vehicleBookingAPI.get("/", { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get owner's vehicle bookings (authenticated)
  getMyBookings: async (params: BookingFilters = {}) => {
    try {
      const response = await vehicleBookingAPI.get("/my-bookings", {
        params,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get customer's own vehicle bookings (authenticated)
  getCustomerBookings: async (params: BookingFilters = {}) => {
    try {
      const response = await vehicleBookingAPI.get("/customer-bookings", {
        params,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get single vehicle booking
  getBookingById: async (id: string) => {
    try {
      const response = await vehicleBookingAPI.get(`/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Create new vehicle booking
  createBooking: async (bookingData: Partial<VehicleBooking>) => {
    try {
      const response = await vehicleBookingAPI.post("/", bookingData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Update vehicle booking
  updateBooking: async (id: string, updateData: Partial<VehicleBooking>) => {
    try {
      const response = await vehicleBookingAPI.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Update booking status
  updateBookingStatus: async (
    id: string,
    status?: string,
    cancellationReason: string | null = null,
    adminStatus?: string,
    ownerStatus?: string
  ) => {
    try {
      const requestBody: any = {};
      if (status) requestBody.status = status;
      if (cancellationReason)
        requestBody.cancellationReason = cancellationReason;
      if (adminStatus) requestBody.adminStatus = adminStatus;
      if (ownerStatus) requestBody.ownerStatus = ownerStatus;

      const response = await vehicleBookingAPI.patch(
        `/${id}/status`,
        requestBody
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Delete vehicle booking
  deleteBooking: async (id: string) => {
    try {
      const response = await vehicleBookingAPI.delete(`/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get booking statistics
  getStatistics: async (period: string = "month") => {
    try {
      const response = await vehicleBookingAPI.get("/statistics", {
        params: { period },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },
};

// Vehicle API functions
const vehicleAPI = axios.create({
  baseURL: `${API_BASE_URL}/vehicles`,
  headers: {
    "Content-Type": "application/json",
  },
});

vehicleAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const vehicleService = {
  // Get all vehicles with filtering
  getAllVehicles: async (params: VehicleFilters = {}) => {
    try {
      const response = await vehicleAPI.get("/", { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get owner's vehicles (authenticated)
  getMyVehicles: async (params: VehicleFilters = {}) => {
    try {
      const response = await vehicleAPI.get("/my-vehicles", { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get single vehicle
  getVehicleById: async (
    id: string,
    params: { startDate?: string; endDate?: string } = {}
  ) => {
    try {
      const response = await vehicleAPI.get(`/${id}`, { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Create new vehicle
  createVehicle: async (vehicleData: Partial<Vehicle>) => {
    try {
      const response = await vehicleAPI.post("/", vehicleData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Update vehicle
  updateVehicle: async (id: string, updateData: Partial<Vehicle>) => {
    try {
      const response = await vehicleAPI.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Toggle vehicle availability
  toggleAvailability: async (
    id: string,
    available: boolean,
    reason: string | null = null
  ) => {
    try {
      const response = await vehicleAPI.patch(`/${id}/availability`, {
        available,
        reason,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Delete vehicle
  deleteVehicle: async (id: string) => {
    try {
      const response = await vehicleAPI.delete(`/${id}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get vehicle statistics
  getStatistics: async () => {
    try {
      const response = await vehicleAPI.get("/statistics");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Get available vehicles for specific dates
  getAvailableVehicles: async (params: {
    startDate: string;
    endDate: string;
    category?: string;
    location?: string;
  }) => {
    try {
      const response = await vehicleAPI.get("/available", { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },
};

export default { vehicleBookingService, vehicleService };
