import React from 'react';
import { Navigate } from 'react-router-dom';

// This component checks if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken"); // Or any other auth check

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;