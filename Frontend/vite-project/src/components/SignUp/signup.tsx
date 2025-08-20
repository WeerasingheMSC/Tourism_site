import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom"; // adjust if needed
import { registerApi } from "../../api/auth"; // import your API helper

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
}

const SignupPage: React.FC = () => {
  // Form data state
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength checker (for border color styling)
  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  // Returns border color class based on validation
  const getInputBorderColor = (field: keyof RegisterFormData): string => {
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
    if (field === "name") {
      // Simple validation: show red border if error on name
      return errors.name ? "border-red-400" : "border-gray-200";
    }
    return "border-gray-200";
  };

  // Update form data on input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Toggle password visibility
  const togglePassword = (): void => {
    setShowPassword((prev) => !prev);
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Client-side validation
    const newErrors: ValidationErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
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

    setIsLoading(true);

    try {
      // Call backend register API
      const { token, user, message } = await registerApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "tourist", // optional; your backend can assign default role if omitted
      });

      // Save token & user info to localStorage (or use context/redux)
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log(message); // Show success message

      // Redirect after signup success
      navigate("/login"); // or '/dashboard' if you want auto-login
    } catch (error: any) {
      // Handle errors from backend
      const backendMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      // Set backend message as general form error under password (or you can customize)
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: backendMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  function handleSocialLogin(_arg0: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 via-transparent to-blue-600/20"></div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-sky-400/10 w-full max-w-5xl grid lg:grid-cols-2 min-h-[600px] overflow-hidden border border-sky-400/10 relative z-10">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-sky-400 to-blue-600 flex flex-col justify-center items-center p-8 lg:p-12 text-center relative overflow-hidden">
          {/* Floating Animation Background */}
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
            {/* Welcome Icon */}
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 mx-auto">
              <svg
                className="w-10 h-10 text-white"
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

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
              Adventure Awaits Start Your Journey with Us!
            </h1>
            <p className="text-white/90 text-lg leading-relaxed max-w-sm">
              Create your account to start your journey and enjoy a seamless
              experience
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Sign Up</h2>
            <p className="text-gray-600">
              Please enter your details to Register
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 ${getInputBorderColor(
                  "name"
                )} rounded-xl focus:border-sky-400 focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-sky-400/10 focus:-translate-y-1`}
                placeholder="Enter your full name"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
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
                className={`w-full px-4 py-3 border-2 ${getInputBorderColor(
                  "email"
                )} rounded-xl focus:border-sky-400 focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-sky-400/10 focus:-translate-y-1`}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
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
                  className={`w-full px-4 py-3 pr-12 border-2 ${getInputBorderColor(
                    "password"
                  )} rounded-xl focus:border-sky-400 focus:ring-0 focus:outline-none transition-all duration-300 hover:border-gray-300 focus:shadow-lg focus:shadow-sky-400/10 focus:-translate-y-1`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sky-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
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
              <span className="text-sky-400 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer"
              
               onClick={()=> navigate("/login")} >Have an account ?</span>
              
                
             
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
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
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-sky-400 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden ${
                isLoading
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:shadow-xl hover:shadow-sky-400/30 hover:-translate-y-1"
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
                  Signing up...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm">or continue with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>
          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center space-x-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-sky-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-400/10 transition-all duration-300 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span className="font-medium text-gray-700 group-hover:text-sky-400 transition-colors duration-200">
                Google
              </span>
            </button>

            <button
              onClick={() => handleSocialLogin("facebook")}
              className="flex items-center justify-center space-x-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-sky-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-400/10 transition-all duration-300 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-gray-700 group-hover:text-sky-600 transition-colors">
                Facebook
              </span>
            </button>
          </div>
          {/* Sign Up Link */}
          <div className="text-center text-gray-600 bolter">
            Enjoy your first booking with us....!
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default SignupPage;
