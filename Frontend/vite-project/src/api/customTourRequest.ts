import axios from "axios";

// (1) Create an Axios instance with a base URL
//     Adjust the baseURL to match where your backend is running.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2️⃣ Export a function that hits POST /requests with your form payload
export function submitTourRequest(payload: any) {
  return api.post("/api/tours/requests", payload);
}
/**
 * 🔄 Fetch all pending custom tour requests
 */
export function getCustomTourRequests() {
  const token = localStorage.getItem("authToken");
  return api.get("/api/tours/requests", {
    headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" },
  });
}
/**
 * 🔄 Fetch one custom tour request by its ID
 */
export function getCustomTourRequestById(id: string) {
  const token = localStorage.getItem("authToken");
  return api.get(`/api/tours/requests/${id}`, {
    headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" },
  });
}

/** 🔄 NEW: update one request’s status by ID */
export function updateCustomTourRequestStatus(id: string, status: string) {
  const token = localStorage.getItem("authToken");
  return api.put(
    `/api/tours/requests/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    }
  );
}
/**
 * 🔄 Fetch all pending custom tour requests
 */
export function getCustomTourRequestsAll() {
  const token = localStorage.getItem("authToken");
  return api.get("/api/tours/noStatusRequests", {
    headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" },
  });
}
