// src/components/PrivateRoutes.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user } = useAuth(); // Get user from AuthContext

  return user ? <Outlet /> : <Navigate to="/login" />; // Redirect to login if not authenticated
};

export default PrivateRoute;
