import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Check if the user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token !== null; // Return true if the token exists, false otherwise
  };

  const handleLogout = () => {
    // Clear the token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect the user to the login page after logging out
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to the Home Page</h1>

      {/* Conditionally render based on the authentication status */}
      {isAuthenticated() ? (
        <div>
          <p>You are logged in!</p>
          <Link to="/dashboard">
            <button>Go to Dashboard</button>
          </Link>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/signup">
            <button style={{ marginLeft: '10px' }}>Sign Up</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
