import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRouteLogin = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('loggedIn'); // Should return '1' (true) or '0' (false).

  // Redirect to '/login' if not logged in, otherwise allow access.
  if (isLoggedIn === '1') {
    return <Navigate to="/chat" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRouteLogin;
