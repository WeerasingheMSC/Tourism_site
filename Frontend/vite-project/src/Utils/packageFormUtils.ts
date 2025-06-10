// src/utils/packageFormUtils.ts
import type { CreatePackageRequest, BackendDailyPlan, BackendPackageItem } from '../api/packages';

// Frontend types
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

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// File validation interface
export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Transform frontend form data to backend format
 */
export const transformFormDataForBackend = (
  formData: PackageFormData,
  includedItems: PackageItem[],
  notIncludedItems: PackageItem[]
): CreatePackageRequest => {
  // Transform daily plans (remove id, ensure activities and locations are arrays)
  const backendDailyPlans: BackendDailyPlan[] = formData.dailyPlans.map(plan => ({
    day: plan.day,
    title: plan.title.trim(),
    description: plan.description.trim(),
    activities: plan.activities || [],
    locations: plan.locations || []
  }));

  // Transform package items (remove id)
  const backendIncludedItems: BackendPackageItem[] = includedItems.map(item => ({
    text: item.text.trim()
  }));

  const backendNotIncludedItems: BackendPackageItem[] = notIncludedItems.map(item => ({
    text: item.text.trim()
  }));

  return {
    name: formData.name.trim(),
    theme: formData.theme.trim(),
    description: formData.description.trim(),
    idealFor: formData.idealFor,
    startingPrice: parseFloat(formData.startingPrice),
    dailyPlans: backendDailyPlans,
    includedItems: backendIncludedItems,
    notIncludedItems: backendNotIncludedItems,
    status: 'draft' // Default to draft
  };
};

/**
 * Validate package form data
 */
export const validatePackageForm = (
  formData: PackageFormData,
  includedItems: PackageItem[],
  notIncludedItems: PackageItem[]
): ValidationResult => {
  const errors: string[] = [];

  // Basic field validation
  if (!formData.name.trim()) {
    errors.push('Package name is required');
  } else if (formData.name.length > 100) {
    errors.push('Package name cannot exceed 100 characters');
  }

  if (!formData.theme.trim()) {
    errors.push('Theme is required');
  } else if (formData.theme.length > 50) {
    errors.push('Theme cannot exceed 50 characters');
  }

  if (!formData.description.trim()) {
    errors.push('Description is required');
  } else if (formData.description.length > 200) {
    errors.push('Description cannot exceed 200 characters');
  }

  // Ideal for validation
  if (formData.idealFor.length === 0) {
    errors.push('At least one "ideal for" option must be selected');
  } else if (formData.idealFor.length > 4) {
    errors.push('Cannot select more than 4 "ideal for" options');
  }

  // Price validation
  const price = parseFloat(formData.startingPrice);
  if (isNaN(price) || price < 0) {
    errors.push('Starting price must be a valid positive number');
  }

  // File validation
  if (!formData.packageIcon) {
    errors.push('Package icon is required');
  }

  if (formData.packagePhotos.length === 0) {
    errors.push('At least one package photo is required');
  } else if (formData.packagePhotos.length > 30) {
    errors.push('Cannot upload more than 30 photos');
  }

  // Daily plans validation
  if (formData.dailyPlans.length === 0) {
    errors.push('At least one daily plan is required');
  } else if (formData.dailyPlans.length > 10) {
    errors.push('Cannot have more than 10 daily plans');
  }

  // Validate each daily plan
  formData.dailyPlans.forEach((plan, index) => {
    if (!plan.title.trim()) {
      errors.push(`Daily plan ${index + 1}: Title is required`);
    }
    if (!plan.description.trim()) {
      errors.push(`Daily plan ${index + 1}: Description is required`);
    }
    if (plan.day < 1) {
      errors.push(`Daily plan ${index + 1}: Day must be a positive number`);
    }
  });

  // Check for duplicate days
  const days = formData.dailyPlans.map(plan => plan.day);
  const duplicateDays = days.filter((day, index) => days.indexOf(day) !== index);
  if (duplicateDays.length > 0) {
    errors.push(`Duplicate day numbers found: ${[...new Set(duplicateDays)].join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate uploaded files
 */
export const validateFiles = (
  packageIcon: File | null,
  packagePhotos: File[]
): FileValidationResult => {
  const errors: string[] = [];

  // Package icon validation
  if (packageIcon) {
    if (!packageIcon.type.startsWith('image/')) {
      errors.push('Package icon must be an image file');
    }
    
    // Check file size (5MB limit)
    if (packageIcon.size > 5 * 1024 * 1024) {
      errors.push('Package icon must be smaller than 5MB');
    }
    
    // Prefer PNG for icons
    if (!packageIcon.type.includes('png') && !packageIcon.type.includes('jpeg') && !packageIcon.type.includes('jpg')) {
      errors.push('Package icon should be PNG, JPEG, or JPG format');
    }
  }

  // Package photos validation
  if (packagePhotos.length > 0) {
    // Check individual photos
    packagePhotos.forEach((photo, index) => {
      if (!photo.type.startsWith('image/')) {
        errors.push(`Photo ${index + 1}: Must be an image file`);
      }
      
      // Check file size (10MB limit per photo)
      if (photo.size > 10 * 1024 * 1024) {
        errors.push(`Photo ${index + 1}: Must be smaller than 10MB`);
      }
    });

    // Check total size of all photos (50MB limit)
    const totalPhotoSize = packagePhotos.reduce((sum, photo) => sum + photo.size, 0);
    if (totalPhotoSize > 50 * 1024 * 1024) {
      errors.push('Total size of all photos must be smaller than 50MB');
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Create a new daily plan with default values
 */
export const createNewDailyPlan = (dayNumber: number, title: string, description: string): DailyPlan => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    day: dayNumber,
    title: title.trim(),
    description: description.trim(),
    activities: [],
    locations: []
  };
};

/**
 * Create a new package item with default values
 */
export const createNewPackageItem = (text: string): PackageItem => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    text: text.trim()
  };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file type icon/emoji
 */
export const getFileTypeIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('video')) return '🎥';
  if (mimeType.includes('audio')) return '🎵';
  return '📁';
};

/**
 * Check if form has unsaved changes
 */
export const hasUnsavedChanges = (
  formData: PackageFormData,
  includedItems: PackageItem[],
  notIncludedItems: PackageItem[]
): boolean => {
  return (
    formData.name.trim() !== '' ||
    formData.theme.trim() !== '' ||
    formData.description.trim() !== '' ||
    formData.idealFor.length > 0 ||
    formData.startingPrice !== '29.99' ||
    formData.packageIcon !== null ||
    formData.packagePhotos.length > 0 ||
    formData.dailyPlans.length > 0 ||
    includedItems.length > 0 ||
    notIncludedItems.length > 0
  );
};

/**
 * Reset form to initial state
 */
export const getInitialFormState = (): PackageFormData => {
  return {
    name: '',
    theme: '',
    description: '',
    idealFor: [],
    startingPrice: '29.99',
    packageIcon: null,
    packagePhotos: [],
    dailyPlans: []
  };
};

/**
 * Validate ideal for options against backend enum
 */
export const validateIdealForOptions = (selectedOptions: string[]): ValidationResult => {
  const validOptions = [
    'Young travelers', 'surfers', 'backpackers', 'Pilgrims', 'seniors', 
    'spiritual seekers', 'Firsttime visitors', 'groups', 'Families', 
    'couples', 'mixed-interest groups', 'photographers', 'Natural lovers',
    'beach lovers', 'solo travelers', 'local explorers', 'Honeymooners', 
    'special event', 'anniversary couples', 'students', 'History lovers'
  ];

  const errors: string[] = [];
  const invalidOptions = selectedOptions.filter(option => !validOptions.includes(option));
  
  if (invalidOptions.length > 0) {
    errors.push(`Invalid ideal for options: ${invalidOptions.join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
};

export default {
  transformFormDataForBackend,
  validatePackageForm,
  validateFiles,
  createNewDailyPlan,
  createNewPackageItem,
  formatFileSize,
  getFileTypeIcon,
  hasUnsavedChanges,
  getInitialFormState,
  validateIdealForOptions
};