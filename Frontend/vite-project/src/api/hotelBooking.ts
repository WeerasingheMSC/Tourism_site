// src/api/hotelBooking.ts

import axios from 'axios';

// (1) Create an Axios instance with the same base URL & JSON headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// (2) Attach your auth token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Payload & Response Types ----------
export interface BookingData {
  hotelId: string;
  roomType: string;
  startDate: string;      // ISO date string, e.g. "2025-09-15"
  endDate: string;        // ISO date string, e.g. "2025-09-20"
  numRooms: number;
  contactNumber: string;
}

export interface BookingResponse {
  message: string;
  booking: any;
}

// ---------- API Calls ----------

/**
 * Create a new booking for the logged-in tourist
 */
export async function createBooking(
  data: BookingData
): Promise<BookingResponse> {
  const { data: resp } = await api.post<BookingResponse>(
    '/api/hotel-bookings',
    data
  );
  return resp;
}

/**
 * Fetch all bookings for the current user (tourist view)
 */
export async function getMyBookings(): Promise<any[]> {
  const { data } = await api.get<any[]>('/api/hotel-bookings/me');
  return data;
}

/**
 * Fetch all bookings for a given hotel (owner view)
 */
export async function getHotelBookings(
  hotelId: string
): Promise<any[]> {
  const { data } = await api.get<any[]>(
    `/api/hotel-bookings/hotel/${hotelId}`
  );
  return data;
}

// ---------- Types ----------
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'completed';

export interface HotelBookingRow {
  _id: string;
  hotelId: string;
  hotelName: string;
  roomType: string;
  startDate: string;           // ISO
  endDate: string;             // ISO
  numRooms: number;
  contactNumber: string;
  unitPrice: number;
  nights: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  user: string | { _id: string; name?: string; email?: string };
  createdAt: string;
}

// ---------- Admin-only ----------
/** GET /api/hotel-bookings  (admin) */
export async function getAllHotelBookings(): Promise<HotelBookingRow[]> {
  const { data } = await api.get<HotelBookingRow[]>('/api/hotel-bookings');
  return data;
}

/** PUT /api/hotel-bookings/:id/status  (admin) */
export async function updateHotelBookingStatus(
  id: string,
  status: BookingStatus
) {
  const { data } = await api.put(`/api/hotel-bookings/${id}/status`, { status });
  return data; // { message, booking }
}
