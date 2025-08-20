// Production authentication helper for vehicle owners
// This works with real JWT tokens from the backend

export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem("authToken");
};

// Get current vehicle owner info from JWT token
export const getCurrentVehicleOwner = (): any | null => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    // Decode JWT token manually (simple base64 decode for payload)
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    const user = JSON.parse(decodedPayload);

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (user.exp && user.exp < currentTime) {
      clearAuthToken();
      return null;
    }

    // Ensure we have the id field for backward compatibility
    if (user.userId && !user.id) {
      user.id = user.userId;
    }

    return user;
  } catch (error) {
    console.error("Error decoding token:", error);
    clearAuthToken();
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const user = getCurrentVehicleOwner();
  return user !== null && user.role === "transport-owner";
};

// Logout function to clear authentication
export const logout = (): void => {
  clearAuthToken();
  // Optionally redirect to login page
  window.location.href = "/login";
};

// Create a test JWT token for development purposes
const createTestToken = (): string => {
  // Create a test payload
  const payload = {
    id: "test-user-id",
    userId: "test-user-id", // for backward compatibility
    role: "transport-owner",
    email: "test@example.com",
    name: "Test User",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours from now
    iat: Math.floor(Date.now() / 1000),
  };

  // Create a simple base64 encoded token (header.payload.signature)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadBase64 = btoa(JSON.stringify(payload));
  const signature = "test-signature"; // dummy signature for testing

  return `${header}.${payloadBase64}.${signature}`;
};

export const ensureAuthForTesting = (): void => {
  const existingToken = getAuthToken();
  if (!existingToken) {
    const testToken = createTestToken();
    setAuthToken(testToken);
    console.log("Created test authentication token for development");
  }
};
