import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance for vehicle owner API
const vehicleOwnerAPI = axios.create({
  baseURL: `${API_BASE_URL}/vehicle-owners`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
vehicleOwnerAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Type definitions
export interface VehicleOwnerProfile {
  _id?: string;
  userId: string;
  ownerName: string;
  businessName?: string;
  email: string;
  phone: string;
  businessRegistrationNumber?: string;
  nicNo: string;
  address?: {
    street?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };
  businessType?: 'individual' | 'company' | 'partnership';
  yearsOfExperience?: number;
  isVerified?: boolean;
  profileCompleted?: boolean;
  completedSteps?: string[];
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
    };
    businessHours?: {
      start?: string;
      end?: string;
      workingDays?: string[];
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfileCheckResponse {
  success: boolean;
  profileExists: boolean;
  profileCompleted: boolean;
  completedSteps: string[];
}

// Vehicle Owner Profile API functions
export const vehicleOwnerService = {
  // Get vehicle owner profile
  getProfile: async () => {
    try {
      const response = await vehicleOwnerAPI.get('/profile');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Create or update vehicle owner profile
  createOrUpdateProfile: async (profileData: Partial<VehicleOwnerProfile>) => {
    try {
      const response = await vehicleOwnerAPI.post('/profile', profileData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Check if profile exists
  checkProfileExists: async (): Promise<ProfileCheckResponse> => {
    try {
      const response = await vehicleOwnerAPI.get('/profile/check');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },

  // Update profile completion step
  updateProfileStep: async (step: string, completed: boolean) => {
    try {
      const response = await vehicleOwnerAPI.put('/profile/step', { step, completed });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError.response?.data || axiosError.message;
    }
  },
};
