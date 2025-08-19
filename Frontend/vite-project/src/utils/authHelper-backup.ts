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
  return user !== null && user.role === 'transport-owner';
};

// Logout function to clear authentication
export const logout = (): void => {
  clearAuthToken();
  // Optionally redirect to login page
  window.location.href = '/login';
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('testUser');
};

export const ensureAuthForTesting = (): void => {
  const existingToken = getAuthToken();
  if (!existingToken) {
    const testToken = createTestToken();
    setAuthToken(testToken);
    console.log('Created test authentication token for development');
  }
};
