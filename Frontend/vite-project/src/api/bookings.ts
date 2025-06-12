// src/api/bookings.ts
import axios from "axios";

// (1) Create an Axios instance with a base URL
//     Adjust the baseURL to match where your backend is running.
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * (A) Create a new booking for the logged-in tourist.
 *     POST /api/bookings
 * @param payload  { packageId: string; whatsappNumber: string }
 */
export function addBooking(payload: { packageId: string; whatsappNumber: string }) {
  const token = localStorage.getItem("authToken");
  return api.post("/api/bookings", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * (B) Fetch all bookings for the logged-in tourist.
 *     GET /api/bookings
 *     Skips client-side cache to always show the latest.
 */
export function getBookings() {
  const token = localStorage.getItem("authToken");
  return api.get("/api/bookings", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
}

/**
 * (C) Fetch one booking by its ID.
 *     GET /api/bookings/:id
 * @param id  The booking’s MongoDB _id
 */
export function getBooking(id: string) {
  const token = localStorage.getItem("authToken");
  return api.get(`/api/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
// ─── NEW: Admin-only endpoint ───────────────────────────────
// (A) Fetch every booking in the system
export function getAllBookings() {
  const token = localStorage.getItem("authToken");
  return api.get("/api/bookings/all", {
    headers: { Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache"
     }
  });
}

// ─── NEW: Update booking status ─────────────────────────────
/**
 * PUT /api/bookings/:id/status
 * @param id      Booking _id
 * @param status  "pending"|"confirmed"|"cancelled"|"approved"
 */
export function updateBookingStatus(id: string, status: string) {
  const token = localStorage.getItem("authToken");
  return api.put(
    `/api/bookings/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
