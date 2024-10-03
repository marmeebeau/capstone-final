// src/components/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth(); // Access user and logout from context

    const firstName = user?.coordinator?.coor_fname || "User";
    const lastName = user?.coordinator?.coor_lname || "";

    const handleLogout = () => {
        logout(); // Call logout when the button is clicked
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {firstName} {lastName}!</p>
            <button onClick={handleLogout}>Log Out</button>

            <nav>
                <Link to='/profile'>Profile</Link>
            </nav>
        </div>
    );
};

export default Dashboard;
