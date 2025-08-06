import axios from 'axios';


// (1) Create an Axios instance with a base URL 
//     Adjust the baseURL to match where your backend is running.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------- Payload & Response Types ----------
export interface HotelRegistrationData {
  name: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country?: string;
    postalCode?: string;
    geoLocation?: { type: 'Point'; coordinates: [number, number] }; // optional
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  amenities?: string[];
  starRating?: number;
  roomTypes?: Array<{
    name: string;
    description?: string;
    pricePerNight?: number;
    totalRooms?: number;
    amenities?: string[];
    maxOccupancy?: number;
  }>;
  images?: string[];
  policies?: {
    checkInTime?: string;
    checkOutTime?: string;
    cancellationPolicy?: string;
    childrenAndBeds?: string;
    ageRestriction?: string;
    petsAllowed?: boolean;
  };
  faqs?: Array<{ question: string; answer: string }>;
}

export interface HotelResponse {
  message: string;
  hotel: any;
}

export interface ReviewData {
  rating: number;
  comment?: string;
}

// ---------- API Calls ----------

/**
 * Register a new hotel (hotel-owner only)
 */
export async function registerHotel(data: HotelRegistrationData): Promise<HotelResponse> {
  const { data: resp } = await api.post<HotelResponse>('/api/hotels', data)
  return resp
}

/**
 * Fetch all pending hotels (admin only)
 */
export async function getPendingHotels(): Promise<any[]> {
  const response = await api.get<any[]>('/api/hotels/pending');
  return response.data;
}

/**
 * Approve or reject a hotel (admin only)
 */
export async function approveRejectHotel(
  id: string,
  status: 'approved' | 'rejected',
  adminNotes?: string
): Promise<HotelResponse> {
  const payload = { status, adminNotes };
  const response = await api.put<HotelResponse>(
    `/api/hotels/${id}/approve`,
    payload
  );
  return response.data;
}

/**
 * Get all approved hotels (public)
 */
export async function getApprovedHotels(): Promise<any[]> {
  const response = await api.get<any[]>('/api/hotels');
  return response.data;
}

/**
 * Get a single approved hotel by ID (public)
 */
export async function getApprovedHotelById(
  id: string
): Promise<any> {
  const response = await api.get<any>(`/api/hotels/${id}`);
  return response.data;
}

/**
 * Submit a user review for a hotel (authenticated)
 */
export async function addReviewToHotel(
  id: string,
  review: ReviewData
): Promise<any> {
  const response = await api.post<any>(`/api/hotels/${id}/reviews`, review);
  return response.data;
}

