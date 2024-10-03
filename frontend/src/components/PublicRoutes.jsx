// src/components/PublicRoutes.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoutes = () => {
  const { user } = useAuth(); // Get user from AuthContext

  // If user is authenticated, redirect to the dashboard
  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoutes;
