import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('token');

  // If no token is found, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // If token exists, render the protected component
  return children;
};

export default ProtectedRoute;