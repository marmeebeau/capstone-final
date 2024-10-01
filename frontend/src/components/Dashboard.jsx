import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth(); // Access user and logout from context
    const navigate = useNavigate();

    // Extract first and last name of the user
    const firstName = user?.coordinator?.coor_fname || "User";
    const lastName = user?.coordinator?.coor_lname || "";

    // Check if the current user is an admin
    const isAdmin = user?.coordinator?.coor_role === 'Admin';

    // Handle logout and navigate to login page
    const handleLogout = () => {
        logout(); // Call logout from AuthContext
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {firstName} {lastName}!</p>

            <button onClick={handleLogout}>Log Out</button>

            <nav>
                <ul>
                    <li><Link to="/profile">Profile</Link></li>
                    {/* Conditionally render Manage Users link if the user is an admin */}
                    {isAdmin && (
                        <li><Link to="/manage-users">Manage Users</Link></li>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Dashboard;
