import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicRoutes from './components/PublicRoutes';
import PrivateRoutes from './components/PrivateRoutes';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import Profile from './components/Profile';
import ManageUsers from './components/ManageUsers'; // New Admin-only component

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
          </Route>

          {/* Private routes for authenticated users */}
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin-only route */}
          <Route element={<PrivateRoutes requiredRole="Admin" />}>
            <Route path="/manage-users" element={<ManageUsers />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
