import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  const userRole = user?.coordinator?.coor_role;
  console.log("User Role in PrivateRoute:", userRole); // Debugging log

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
