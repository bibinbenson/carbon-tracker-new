import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // For testing: bypass authentication check temporarily
  const isAuthenticated = true; // Always return true for testing
  
  // Uncomment this for production use:
  // const isAuthenticated = localStorage.getItem('token') !== null;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 