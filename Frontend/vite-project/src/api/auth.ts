// src/api/auth.ts
import axios from 'axios';


// (1) Create an Axios instance with a base URL 
//     Adjust the baseURL to match where your backend is running.
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5001', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// (2) Interface for login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// (3) Interface for the login response
interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  message: string;
}

// (4) Function to call POST /api/auth/login
export async function loginApi(creds: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/auth/login', creds);
  return response.data;
}

// (5) Similarly, you could add register, forgotPassword, resetPassword:
interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}
export async function registerApi(data: RegisterData) {
  const response = await api.post('/api/auth/register', data);
  return response.data; // { message, token, user }
  
}

interface ForgotPasswordData {
  email: string;
}
export async function forgotPasswordApi(data: ForgotPasswordData) {
  return await api.post('/api/auth/forgot-password', data);
}

interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}
export async function resetPasswordApi(data: ResetPasswordData) {
  return await api.post('/api/auth/resetPassword', data);
}

// (6) Export the raw Axios instance in case you want to set default headers later
export default api;
