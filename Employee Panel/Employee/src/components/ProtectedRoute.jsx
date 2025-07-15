import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('loggedInUser');

  return isLoggedIn ? children : <Navigate to="/employeelogin" replace />;
};

export default ProtectedRoute;