// src/pages/LoginPage.tsx
import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom"; // or your router hook of choice
import { loginApi } from "../../api/auth"; // ← import the login function

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  // (A) State for form data, loading, errors
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate(); // (B) react-router hook, adjust if you use a different router

  // (C) Email regex & password strength remain the same
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getInputBorderColor = (field: keyof LoginFormData): string => {
    if (field === "email") {
      if (!formData.email) return "border-gray-200";
      return validateEmail(formData.email)
        ? "border-green-400"
        : "border-red-400";
    }
    if (field === "password") {
      if (!formData.password) return "border-gray-200";
      const strength = getPasswordStrength(formData.password);
      const colors = [
        "border-red-400",
        "border-yellow-400",
        "border-yellow-400",
        "border-green-400",
      ];
      return colors[Math.min(strength, 3)];
    }
    return "border-gray-200";
  };

  // (D) Handle input changes as before
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors on the fly
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const togglePassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleSocialLogin = (
    provider: "google" | "microsoft" | "facebook"
  ): void => {
    alert(
      `Redirecting to ${
        provider.charAt(0).toUpperCase() + provider.slice(1)
      } login...`
    );
  };

  // (E) Replace handleSubmit with real API call and handle backend errors
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // 1) Client-side validation
    const newErrors: ValidationErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 2) If no errors, call backend
    setIsLoading(true);
    try {
      // call the login API from src/api/auth.ts
      const { token, user, message } = await loginApi({
        email: formData.email,
        password: formData.password,
      });

      // 3) On success, store token & user info as needed
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 4) Optionally, if rememberMe is checked
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      console.log("Login successful for user:", user);
      console.log(message); // "Login successful" from your backend

      // 5) Redirect to related dashboard based on user.role
      // Assuming your user object has a 'role' property that can be 'admin', 'seller', 'buyer', etc.
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "hotel-owner") {
        navigate("/hotel-owner-dashboard");
      } else if (user.role === "transport-owner") {
        navigate("/transport-owner-dashboard");
      } else {
        // fallback or default dashboard
        navigate("/");
      }
    } catch (error: any) {
      // 6) Handle failure: show backend's error message below the password field
      console.error("Login error:", error);
      const backendMessage =
        error.response?.data?.message || "Login failed. Please try again.";

      // Set backend error under password (or you could distribute differently)
      setErrors({ password: backendMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // (F) Render JSX as before, but wire <form onSubmit={handleSubmit}>
  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-20">
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-transparent to-blue-600/20"></div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-sky-400/10 w-full max-w-5xl grid lg:grid-cols-2 min-h-[500px] sm:min-h-[600px] overflow-hidden border border-sky-400/10 relative z-10">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-sky-400 to-blue-600 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0s", animationDuration: "3s" }}
            ></div>
            <div
              className="absolute top-32 right-16 w-12 h-12 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "1s", animationDuration: "4s" }}
            ></div>
            <div
              className="absolute bottom-20 left-20 w-16 h-16 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "2s", animationDuration: "5s" }}
            ></div>
            <div
              className="absolute bottom-32 right-12 w-8 h-8 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
            ></div>
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 sm:mb-8 mx-auto">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
                ></path>
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Welcome Back!
            </h1>
            <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-sm px-4 sm:px-0">
              We're excited to see you again. Enter your credentials to access
              your account and continue your journey.
            </p>
          </div>
        </div>

        {/* Form Section (with <form> wrapper) */}
        <div className="p-6 sm:p-8 lg:p-12 shadow-2xl border-b-amber-50 flex flex-col justify-center">
          {/* Form Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">Log In</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Please enter your details to continue
            </p>
          </div>

          {/* Wrap in <form> so that onSubmit fires on "Enter" or button click */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 ${getInputBorderColor(
                  "email"
                )} rounded-xl focus:border-sky-400 focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-sky-400/10 focus:-translate-y-1 text-sm sm:text-base`}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 ${getInputBorderColor(
                    "password"
                  )} rounded-xl focus:border-sky-400 focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-sky-400/10 focus:-translate-y-1 text-sm sm:text-base`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-sky-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      ></path>
                    ) : (
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        ></path>
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Form Options */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm space-y-2 sm:space-y-0">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-sky-400 border-gray-300 rounded focus:ring-sky-400 focus:ring-2"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <span
              className="text-sky-400 hover:text-blue-600 font-medium transition-colors duration-200 text-center sm:text-left cursor-pointer"
              onClick={()=> navigate("/forgot-password")}
              >Forgot Password?</span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-sky-400 to-blue-600 text-white py-2.5 sm:py-3 px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 relative overflow-hidden ${
                isLoading
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:shadow-xl hover:shadow-sky-400/30 hover:-translate-y-1"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loging In...
                </div>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 sm:my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-xs sm:text-sm">or continue with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-gray-200 rounded-xl hover:border-sky-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-400/10 transition-all duration-300 group"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium text-gray-700 group-hover:text-sky-400 transition-colors duration-200 text-xs sm:text-sm">
                Google
              </span>
            </button>

            <button
              onClick={() => handleSocialLogin("facebook")}
              className="flex items-center justify-center space-x-2 py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-gray-200 rounded-xl hover:border-sky-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-400/10 transition-all duration-300 group"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-gray-700 group-hover:text-sky-600 transition-colors text-xs sm:text-sm">
                Facebook
              </span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-gray-600 text-sm">
            Don't have an account?
            <span  
            onClick={()=>navigate("/signup")}
            className="text-sky-400 hover:text-blue-600 font-semibold transition-colors duration-200 hover:underline ml-1 cursor-pointer"
           >Sign up here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;