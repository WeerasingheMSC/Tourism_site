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
    // Handle both backend format (userId) and old format (id)
    if (user.userId && !user.id) {
      user.id = user.userId;
    }
    if (user.id && !user.userId) {
      user.userId = user.id;
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

// General authentication check for any user role (for rating system)
export const isAnyUserAuthenticated = (): boolean => {
  const user = getCurrentVehicleOwner();
  // Accept any user with a valid role for rating vehicles
  return user !== null && !!user.role && !!user.userId;
};

// Get current user info (not just vehicle owners)
export const getCurrentUser = (): any | null => {
  return getCurrentVehicleOwner(); // Same logic but renamed for clarity
};

// Logout function to clear authentication
export const logout = (): void => {
  clearAuthToken();
  // Optionally redirect to login page
  window.location.href = '/login';
};

// Testing helper function to ensure authentication for development
export const ensureAuthForTesting = async (): Promise<void> => {
  // For testing purposes, use a real token if none exists
  if (!getAuthToken()) {
    console.log('🔧 ensureAuthForTesting - Setting up authentication for development');
    
    // First, try to use a known working token for immediate testing
    const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGExOWVhOTc3MDc3YjM0YWI0YzVjOWEiLCJyb2xlIjoidG91cmlzdCIsImlhdCI6MTc1NTQyMjM3NywiZXhwIjoxNzU1NDI1OTc3fQ.AVVHqN4gg5azsWvHu7xBe6h6dfl5FNqJxf3au2drs8g";
    
    try {
      // Check if this token is still valid by trying to decode it
      const payload = testToken.split('.')[1];
      const decodedPayload = atob(payload);
      const tokenData = JSON.parse(decodedPayload);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (tokenData.exp && tokenData.exp > currentTime) {
        setAuthToken(testToken);
        console.log('🔧 Used existing test token for user:', tokenData);
        return;
      } else {
        console.log('🔧 Test token is expired, creating new one...');
      }
    } catch (error) {
      console.log('🔧 Test token invalid, creating new one...');
    }
    
    try {
      // Try to create a new real token
      await createTestUserAndLogin();
    } catch (error) {
      console.error('Failed to create test user, you may need to login manually:', error);
    }
  }
};

// Create a test user and login to get a real JWT token
const createTestUserAndLogin = async (): Promise<void> => {
  const testUser = {
    name: 'Test User',
    email: 'testuser@rating.com',
    password: 'testpassword123',
    role: 'tourist' // Use valid role from User model
  };

  try {
    console.log('🔧 Attempting to register test user...');
    
    // Try to register the test user
    const registerResponse = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    if (registerResponse.ok) {
      const data = await registerResponse.json();
      setAuthToken(data.token);
      console.log('🔧 Test user registered and logged in successfully');
      return;
    } else if (registerResponse.status === 400) {
      // User might already exist, try to login
      console.log('🔧 Test user already exists, attempting login...');
    } else {
      throw new Error(`Registration failed: ${registerResponse.statusText}`);
    }
  } catch (error) {
    console.log('🔧 Registration failed, trying login:', error);
  }

  // Try to login with the test user
  try {
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    if (loginResponse.ok) {
      const data = await loginResponse.json();
      setAuthToken(data.token);
      console.log('🔧 Test user logged in successfully');
    } else {
      throw new Error(`Login failed: ${loginResponse.statusText}`);
    }
  } catch (error) {
    throw new Error(`Both registration and login failed: ${error}`);
  }
};
