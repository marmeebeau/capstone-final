// src/components/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth(); // Access logout function as well

    // Fallback in case user or its fields are missing
    const firstName = user?.coor_fname || "User"; // Fallback to "User" if coor_fname is missing
    const lastName = user?.coor_lname || ""; // Fallback to empty string for last name

    const handleLogout = () => {
        logout(); // Call logout when the button is clicked
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {firstName} {lastName}!</p> {/* Display user name */}
            <button onClick={handleLogout}>Log Out</button>

            <nav> <Link to='/profile'>Profile</Link></nav>
        </div>
    );
};

export default Dashboard;
