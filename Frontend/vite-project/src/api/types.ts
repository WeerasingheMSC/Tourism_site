// src/api/types.ts

// API Response type that matches your backend
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  count?: number;
  pagination?: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Package-related types for frontend
export interface DailyPlan {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: string[];
  locations: string[];
}

export interface PackageItem {
  id: string;
  text: string;
}

export interface PackageFormData {
  name: string;
  theme: string;
  description: string;
  idealFor: string[];
  startingPrice: string;
  packageIcon: File | null;
  packagePhotos: File[];
  dailyPlans: DailyPlan[];
}

// Backend types (for API communication)
export interface BackendDailyPlan {
  day: number;
  title: string;
  description: string;
  activities?: string[];
  locations?: string[];
}

export interface BackendPackageItem {
  text: string;
}

export interface CreatePackageRequest {
  name: string;
  theme: string;
  description: string;
  idealFor: string[];
  startingPrice: number;
  dailyPlans: BackendDailyPlan[];
  includedItems: BackendPackageItem[];
  notIncludedItems: BackendPackageItem[];
  status?: 'draft' | 'published' | 'archived';
}

export interface PackageResponse {
  _id: string;
  name: string;
  theme: string;
  description: string;
  idealFor: string[];
  startingPrice: number;
  packageIcon?: {
    fileName: string;
    publicUrl: string;
  };
  packagePhotos: Array<{
    _id?: string;
    fileName: string;
    publicUrl: string;
  }>;
  dailyPlans: BackendDailyPlan[];
  includedItems: BackendPackageItem[];
  notIncludedItems: BackendPackageItem[];
  status: string;
  views: number;
  bookings: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

// API Error type
export interface ApiError {
  message: string;
  status?: number;
  errors?: string[];
}

// Form validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// File validation result
export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

// Package status
export type PackageStatus = 'draft' | 'published' | 'archived';

// Ideal for options (matching your backend exactly)
export const IDEAL_FOR_OPTIONS = [
  'Young travelers', 
  'surfers', 
  'backpackers', 
  'Pilgrims', 
  'seniors', 
  'spiritual seekers', 
  'Firsttime visitors', 
  'groups', 
  'Families', 
  'couples', 
  'mixed-interest groups', 
  'photographers', 
  'Natural lovers',
  'beach lovers', 
  'solo travelers', 
  'local explorers', 
  'Honeymooners', 
  'special event', 
  'anniversary couples', 
  'students', 
  'History lovers'
] as const;

export type IdealForOption = typeof IDEAL_FOR_OPTIONS[number];

// Package query parameters
export interface PackageQueryParams {
  page?: number;
  limit?: number;
  status?: PackageStatus;
  theme?: string;
  minPrice?: number;
  maxPrice?: number;
  idealFor?: string[];
  search?: string;
  sortBy?: 'name' | 'theme' | 'startingPrice' | 'createdAt' | 'updatedAt' | 'views' | 'bookings';
  sortOrder?: 'asc' | 'desc';
}

// File upload configuration
export interface FileUploadConfig {
  maxFileSize: number;
  maxPhotos: number;
  allowedTypes: string[];
  allowedExtensions: string[];
}

// Package statistics
export interface PackageStats {
  totalPackages: number;
  publishedPackages: number;
  draftPackages: number;
  archivedPackages: number;
  averagePrice: number;
  totalViews: number;
  totalBookings: number;
}

export interface PackageStatsResponse {
  overview: PackageStats;
  packagesByTheme: Array<{
    _id: string;
    count: number;
  }>;
  recentPackages: Array<{
    _id: string;
    name: string;
    theme: string;
    startingPrice: number;
    status: string;
    createdAt: string;
    createdBy?: {
      name: string;
    };
  }>;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// Form states
export interface FormState<T> extends LoadingState {
  data: T;
  isDirty: boolean;
  isValid: boolean;
  validationErrors: string[];
}

// Tab navigation
export type TabName = 'Package details' | 'Daily Agenda' | 'Include & Not include details';

export default {
  IDEAL_FOR_OPTIONS
};