// src/pages/ResetPasswordPage.tsx
import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../../api/auth';  // ← Import your API helper

interface ResetPasswordFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [backendError, setBackendError] = useState<string | null>(null);

  // (A) Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // (B) Password must be at least 6 chars
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // (C) Decide border color based on validation state
  const getInputBorderColor = (field: keyof ResetPasswordFormData): string => {
    if (field === 'email') {
      if (!formData.email) return 'border-gray-200';
      return validateEmail(formData.email) ? 'border-green-400' : 'border-red-400';
    }
    if (field === 'newPassword' || field === 'confirmPassword') {
      if (!formData.newPassword || !formData.confirmPassword) return 'border-gray-200';
      return formData.newPassword === formData.confirmPassword ? 'border-green-400' : 'border-red-400';
    }
    return 'border-gray-200';
  };

  // (D) Handle input changes; clear field-specific or backend errors
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    // Clear any backend error when user modifies input
    if (backendError) {
      setBackendError(null);
    }
  };

  // (E) Submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setBackendError(null); // Clear previous backend error

    // 1) Client-side validation
    const newErrors: ValidationErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 2) Call backend
    setIsLoading(true);
    try {
      // Pass exactly { email, otp, newPassword } to match your controller
      const payload = {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      };
      const response = await resetPasswordApi(payload);
      console.log('Password reset successful:', response.data?.message);
      navigate('/login'); // Redirect to login on success
    } catch (error: any) {
      console.error('Password reset error:', error);
      const message = error.response?.data?.message || 'Failed to reset password. Please try again.';
      setBackendError(message); // Show backend error inline
    } finally {
      setIsLoading(false);
    }
  };

  // (F) If you want a “Back to Login” button handler:
  function handleBackToLogin(): void {
    navigate('/login');
  }

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-transparent to-blue-600/20"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl shadow-sky-400/10 w-full max-w-5xl grid lg:grid-cols-2 min-h-[600px] overflow-hidden border border-sky-400/10 relative z-10">
        {/* Left Panel (unchanged styling) */}
        <div className="bg-gradient-to-br from-sky-400 to-blue-600 flex flex-col justify-center items-center p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
            <div className="absolute top-32 right-16 w-12 h-12 bg-white rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
            <div className="absolute bottom-20 left-20 w-16 h-16 bg-white rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
            <div className="absolute bottom-32 right-12 w-8 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
          </div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 mx-auto">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">Reset Password</h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-sm">Enter your details to reset your password</p>
          </div>
        </div>

        {/* Right Panel (form) */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Reset Your Password</h2>
            <p className="text-gray-600">Please enter your email, OTP, new password, and confirm your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 ${getInputBorderColor('email')} rounded-xl focus:border-sky-400 focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-sky-400/10 focus:-translate-y-1`}
                placeholder="Enter your email"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* OTP Field */}
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 ${getInputBorderColor('otp')} rounded-xl focus:border-sky-400 focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-sky-400/10 focus:-translate-y-1`}
                placeholder="Enter OTP"
                required
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 ${getInputBorderColor('newPassword')} rounded-xl focus:border-sky-400 focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-sky-400/10 focus:-translate-y-1`}
                placeholder="Enter your new password"
                required
              />
              {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 ${getInputBorderColor('confirmPassword')} rounded-xl focus:border-sky-400 focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-sky-400/10 focus:-translate-y-1`}
                placeholder="Confirm your new password"
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-sky-400 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-sky-400/30 hover:-translate-y-1'}`}
            >
              {isLoading ? 'Sending OTP...' : 'Reset Password'}
            </button>

            {/* Display backend error if any */}
            {backendError && <p className="text-red-600 text-sm mt-2">{backendError}</p>}
          </form>

          <div className="text-center mt-8">
            <button onClick={handleBackToLogin} className="text-sky-600 hover:text-blue-600 font-semibold transition-colors duration-200">Back to Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
