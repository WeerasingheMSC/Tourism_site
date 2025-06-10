// src/api/packages.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Define the ApiResponse type to match your backend responses
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

// Types that match your backend
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
}

// Enhanced error handling
export class APIError extends Error {
  public status: number;
  public errors?: string[];

  constructor(message: string, status: number, errors?: string[]) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.errors = errors;
  }
}

// Enhanced API response handler
const handleResponse = async <T>(response: Response): Promise<T> => {
  let data: any;
  
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new APIError(`Invalid response format`, response.status);
  }

  if (!response.ok) {
    const errorMessage = data.message || `HTTP error! status: ${response.status}`;
    const errors = data.errors || [];
    throw new APIError(errorMessage, response.status, errors);
  }

  return data as T;
};

// Package API functions
export const packageAPI = {
  // Create a new package
  async createPackage(
    packageData: CreatePackageRequest,
    files: {
      packageIcon?: File;
      packagePhotos?: File[];
    }
  ): Promise<ApiResponse<PackageResponse>> {
    try {
      console.log('🚀 Creating package...', { packageData, files });
      
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', packageData.name);
      formData.append('theme', packageData.theme);
      formData.append('description', packageData.description);
      formData.append('startingPrice', packageData.startingPrice.toString());
      formData.append('status', packageData.status || 'draft');
      
      // Add arrays as JSON strings
      formData.append('idealFor', JSON.stringify(packageData.idealFor));
      formData.append('dailyPlans', JSON.stringify(packageData.dailyPlans));
      formData.append('includedItems', JSON.stringify(packageData.includedItems));
      formData.append('notIncludedItems', JSON.stringify(packageData.notIncludedItems));
      
      // Add files
      if (files.packageIcon) {
        formData.append('packageIcon', files.packageIcon);
        console.log('📁 Added package icon:', files.packageIcon.name);
      }
      
      if (files.packagePhotos && files.packagePhotos.length > 0) {
        files.packagePhotos.forEach((photo, index) => {
          formData.append('packagePhotos', photo);
          console.log(`📷 Added photo ${index + 1}:`, photo.name);
        });
      }

      // Debug: Log FormData contents (only in development)
      if (import.meta.env.VITE_API_DEBUG === 'true') {
        console.log('📤 FormData contents:');
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`${key}:`, value);
          }
        }
      }

      const response = await fetch(`${API_BASE_URL}/packages`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      });

      const result = await handleResponse<ApiResponse<PackageResponse>>(response);
      console.log('✅ Package created successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Create package error:', error);
      
      if (error instanceof APIError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new APIError('Network error: Unable to connect to server. Please check your internet connection.', 0);
      }
      
      throw new APIError(`Failed to create package: ${(error as Error).message}`, 500);
    }
  },

  // Get all packages
  async getPackages(params?: {
    page?: number;
    limit?: number;
    status?: string;
    theme?: string;
    minPrice?: number;
    maxPrice?: number;
    idealFor?: string[];
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<PackageResponse[]>> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => searchParams.append(key, v.toString()));
            } else {
              searchParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/packages?${searchParams}`);
      return await handleResponse<ApiResponse<PackageResponse[]>>(response);
      
    } catch (error) {
      console.error('Get packages error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to get packages: ${(error as Error).message}`, 500);
    }
  },

  // Get single package
  async getPackage(id: string): Promise<ApiResponse<PackageResponse>> {
    try {
      if (!id) {
        throw new APIError('Package ID is required', 400);
      }

      const response = await fetch(`${API_BASE_URL}/packages/${id}`);
      return await handleResponse<ApiResponse<PackageResponse>>(response);
      
    } catch (error) {
      console.error('Get package error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to get package: ${(error as Error).message}`, 500);
    }
  },

  // Update package
  async updatePackage(
    id: string,
    packageData: Partial<CreatePackageRequest>,
    files?: {
      packageIcon?: File;
      packagePhotos?: File[];
    }
  ): Promise<ApiResponse<PackageResponse>> {
    try {
      if (!id) {
        throw new APIError('Package ID is required', 400);
      }

      const formData = new FormData();
      
      // Add text fields if they exist
      Object.entries(packageData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value) || typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Add files if provided
      if (files?.packageIcon) {
        formData.append('packageIcon', files.packageIcon);
      }
      
      if (files?.packagePhotos && files.packagePhotos.length > 0) {
        files.packagePhotos.forEach((photo) => {
          formData.append('packagePhotos', photo);
        });
      }

      const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
        method: 'PUT',
        body: formData,
      });

      return await handleResponse<ApiResponse<PackageResponse>>(response);
      
    } catch (error) {
      console.error('Update package error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to update package: ${(error as Error).message}`, 500);
    }
  },

  // Delete package
  async deletePackage(id: string): Promise<ApiResponse<null>> {
    try {
      if (!id) {
        throw new APIError('Package ID is required', 400);
      }

      const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
        method: 'DELETE',
      });

      return await handleResponse<ApiResponse<null>>(response);
      
    } catch (error) {
      console.error('Delete package error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to delete package: ${(error as Error).message}`, 500);
    }
  },

  // Delete package photo
  async deletePackagePhoto(packageId: string, photoId: string): Promise<ApiResponse<PackageResponse>> {
    try {
      if (!packageId || !photoId) {
        throw new APIError('Package ID and Photo ID are required', 400);
      }

      const response = await fetch(`${API_BASE_URL}/packages/${packageId}/photos/${photoId}`, {
        method: 'DELETE',
      });

      return await handleResponse<ApiResponse<PackageResponse>>(response);
      
    } catch (error) {
      console.error('Delete package photo error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to delete photo: ${(error as Error).message}`, 500);
    }
  },

  // Get package statistics
  async getPackageStats(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/packages/stats`);
      return await handleResponse<ApiResponse<any>>(response);
      
    } catch (error) {
      console.error('Get package stats error:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Failed to get stats: ${(error as Error).message}`, 500);
    }
  }
};

// Health check function
export const healthCheck = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    
    if (!response.ok) {
      throw new APIError(`Health check failed`, response.status);
    }

    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(`Health check failed: ${(error as Error).message}`, 500);
  }
};

// Test connection function
export const testConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/packages?limit=1`);
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

export default packageAPI;