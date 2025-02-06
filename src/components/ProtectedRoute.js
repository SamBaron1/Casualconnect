import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
