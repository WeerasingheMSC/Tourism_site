// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '../../api/auth';  // Your API call import

interface ForgotPasswordFormData {
  email: string;
}

interface ValidationErrors {
  email?: string;
}

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [backendError, setBackendError] = useState<string | null>(null); // <-- New state for backend errors

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Input border color for validation state
  const getInputBorderColor = (): string => {
    if (!formData.email) return 'border-gray-200';
    return validateEmail(formData.email) ? 'border-green-400' : 'border-red-400';
  };

  // Handle input change and clear errors
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
    if (backendError) {
      setBackendError(null); // Clear backend error when user types again
    }
  };

  // Navigate to login page
  const handleBackToLogin = (): void => {
    navigate('/login');
  };

  // Navigate to register page
  const handleBackToSignin = (): void => {
    navigate('/register');
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    setBackendError(null); // Clear backend error on new submit

    const newErrors: ValidationErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await forgotPasswordApi({ email: formData.email }) as { data: { message: string } };
      setIsEmailSent(true);
      console.log('Reset email sent:', response.data?.message);
    } catch (error: any) {
      console.error('Password reset error:', error);
      const message = error.response?.data?.message || 'Failed to send reset email. Please try again.';
      setBackendError(message); // Show backend error inline
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-5">
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-transparent to-blue-600/20"></div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-sky-400/10 w-full max-w-md p-8 text-center border border-sky-400/10 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Check Your Email</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We've sent a password reset link to <strong>{formData.email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            If you don't see the email, check your spam folder or try again.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setIsEmailSent(false)}
              className="w-full bg-gradient-to-r from-sky-400 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-sky-400/30 hover:-translate-y-1"
            >
              Send Again
            </button>
            <button
              onClick={handleBackToLogin}
              className="w-full py-3 px-6 text-sky-600 font-semibold hover:text-blue-600 transition-colors duration-200"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-transparent to-blue-600/20"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl shadow-sky-400/10 w-full max-w-5xl grid lg:grid-cols-2 min-h-[600px] overflow-hidden border border-sky-400/10 relative z-10">
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
            <p className="text-white/90 text-lg leading-relaxed max-w-sm">Don't worry! We'll help you get back into your account securely</p>
          </div>
        </div>

        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Forgot Password?</h2>
            <p className="text-gray-600">Enter your email address and we'll send you a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pl-12 border-2 ${getInputBorderColor()} rounded-xl focus:border-sky-400 focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-sky-400/10 focus:-translate-y-1`}
                  placeholder="Enter your email address"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              {backendError && <p className="text-red-600 text-sm mt-1">{backendError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-sky-400 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden ${
                isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-sky-400/30 hover:-translate-y-1'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending Reset Link...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Send Reset OTP
                </div>
              )}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="text-center">
            <button
              onClick={handleBackToLogin}
              className="inline-flex items-center space-x-2 text-sky-600 hover:text-blue-600 font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Back to Login</span>
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Remember your password?{' '}
              <button
                onClick={handleBackToSignin}
                className="text-sky-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
