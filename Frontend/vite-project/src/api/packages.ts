import axios from "axios";

// (1) Create an Axios instance with a base URL
//     Adjust the baseURL to match where your backend is running.
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL || 'https://tourism-site-6tl3.onrender.com',
  headers: {
    "Content-Type": "application/json",
  },
});
/**
 * Call your backend to add a new package.
 */
export function addPackage(payload: any) {
  const token = localStorage.getItem("authToken");
  return api.post("/api/packages", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

/**
 * (NEW) Fetch all packages
 */
// fetch all packages, skipping cache
export function getPackages() {
  const token = localStorage.getItem("authToken");
  return api.get("/api/packages", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",  // ← bypass any client-side cache
      Pragma: "no-cache",            // ← older HTTP/1.0 clients
    },
  });
}

/**
 * (NEW) Fetch a single package by its ID
 * @param id The package's MongoDB `_id`
 */
// in src/api/packages.ts
export function getPackageById(id: string) {
  const token = localStorage.getItem("authToken");
  return api.get(`/api/packages/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache", // ← bypass any client-side cache
      Pragma: "no-cache", // ← force reload every time
    },
  });
}

/**
 * 🔄 Delete a package by its MongoDB _id
 * @param id The package's ID
 */
export function deletePackage(id: string) {
  const token = localStorage.getItem("authToken");
  return api.delete(`/api/packages/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
