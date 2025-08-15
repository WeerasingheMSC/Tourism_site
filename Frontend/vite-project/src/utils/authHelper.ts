// Production authentication helper for vehicle owners
// This works with real JWT tokens from the backend

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Get current vehicle owner info from JWT token
export const getCurrentVehicleOwner = (): any | null => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    // Decode JWT token manually (simple base64 decode for payload)
    const payload = token.split('.')[1];
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
    console.error('Error decoding token:', error);
    clearAuthToken();
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const user = getCurrentVehicleOwner();
  // Accept both transport-owner and vehicle-owner roles for backward compatibility
  return user !== null && (user.role === 'transport-owner' || user.role === 'vehicle-owner');
};

// Logout function to clear authentication
export const logout = (): void => {
  clearAuthToken();
  // Optionally redirect to login page
  window.location.href = '/login';
};

// Testing helper function to ensure authentication for development
export const ensureAuthForTesting = (): void => {
  // For testing purposes, create a mock token if none exists
  if (!getAuthToken()) {
    console.log('🔧 ensureAuthForTesting - Creating mock token for development');
    const mockToken = btoa(JSON.stringify({
      id: 'test-vehicle-owner-id',
      email: 'test@vehicleowner.com',
      role: 'vehicle-owner',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const fullMockToken = `header.${mockToken}.signature`;
    setAuthToken(fullMockToken);
  }
};
