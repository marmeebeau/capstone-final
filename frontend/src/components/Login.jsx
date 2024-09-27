import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authServices from '../services/authServices';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true on form submission
        try {
            const userData = await authServices.login(identifier, password);
            setSuccess('Login successful! Redirecting...');
            setError(null);
            // You may want to store user data too
            localStorage.setItem('user', JSON.stringify(userData)); // Store user data
            setTimeout(() => {
                navigate('/dashboard'); // Redirect to dashboard after login
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Error during login:', error);
            setError(error.message || 'An unexpected error occurred.');
            setSuccess(null);
        } finally {
            setLoading(false); // Set loading to false after submission
        }
    };
    
    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Email or Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging In...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;