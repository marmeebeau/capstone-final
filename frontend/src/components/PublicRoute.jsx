import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoutes = () => {
  const { user } = useAuth();

  // If user is authenticated, redirect to dashboard
  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoutes;
