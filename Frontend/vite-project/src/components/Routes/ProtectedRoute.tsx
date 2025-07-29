import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Get user from localStorage

  // If the user is not an admin, redirect them to the login page
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // If the user is an admin, render the children (protected content)
  return <>{children}</>;
};

export default ProtectedRoute;
