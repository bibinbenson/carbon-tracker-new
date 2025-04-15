import React from 'react';
import { useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Bypass authentication completely and always render children
  return <>{children}</>;
};

export default PrivateRoute; 