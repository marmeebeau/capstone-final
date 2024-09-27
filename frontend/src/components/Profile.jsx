import React, { useState, useEffect } from 'react';
import authServices from '../services/authServices';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({
        coor_fname: '',
        coor_lname: '',
        coor_username: '',
        coor_email: '',
        coor_contact: '',
        coor_address: '',
        coor_role: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Load the current user's data when the component mounts
    useEffect(() => {
        // Check if the token is valid when the component mounts
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                
                console.log('Token Expiry Time:', decodedToken.exp);
                console.log('Current Time:', currentTime);

                // Check if the token has expired
                if (decodedToken.exp < currentTime) {
                    setErrorMessage('Session expired. Please log in again.');
                    authServices.logout();  // Clear token and user data
                    window.location.href = '/login';  // Redirect to login
                    return;
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                setErrorMessage('Invalid token. Please log in again.');
                authServices.logout();
                window.location.href = '/login';
                return;
            }
        } else {
            setErrorMessage('No token found. Please log in again.');
            authServices.logout();
            window.location.href = '/login';
            return;
        }

        // Fetch current user data and set the form fields if the token is valid
        const currentUser = authServices.getCurrentUser();
        if (currentUser && currentUser.coordinator) {
            setUser(currentUser.coordinator);
            setFormData({
                coor_fname: currentUser.coordinator.coor_fname || '',
                coor_lname: currentUser.coordinator.coor_lname || '',
                coor_username: currentUser.coordinator.coor_username || '',
                coor_email: currentUser.coordinator.coor_email || '',
                coor_contact: currentUser.coordinator.coor_contact || '',
                coor_address: currentUser.coordinator.coor_address || '',
                coor_role: currentUser.coordinator.coor_role || ''
            });
        }
    }, []); // Empty dependency array to ensure it only runs on mount

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setErrorMessage(''); 
        setSuccessMessage(''); 
    
        // Token expiration check
        const token = localStorage.getItem('token');

        if (!token) {
        setErrorMessage('No token found. Please log in again.');
        setLoading(false);
        return;
    }

    // Decode the token and check if it's expired
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
        setErrorMessage('Session expired. Please log in again.');
        authServices.logout();
        window.location.href = '/login';
        setLoading(false);
        return;
    }

    try {
        authServices.setAuthToken(token); // Ensure that the token is included in all requests
        const response = await axios.put(
            `http://localhost:1337/api/coordinators/${user.id}`,
            {
                data: formData 
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the headers
                }
            }
        );

        setUser(response.data); 
        setSuccessMessage('Profile updated successfully!');
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
        setErrorMessage(errorMessage);
    } finally {
        setLoading(false); 
    }
};

    return (
        <div>
            <h2>Profile</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="coor_fname" value={formData.coor_fname} onChange={handleChange} required />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="coor_lname" value={formData.coor_lname} onChange={handleChange} />
                </div>
                <div>
                    <label>Username:</label>
                    <input type="text" name="coor_username" value={formData.coor_username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="coor_email" value={formData.coor_email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Contact:</label>
                    <input type="text" name="coor_contact" value={formData.coor_contact} onChange={handleChange} />
                </div>
                <div>
                    <label>Address:</label>
                    <textarea name="coor_address" value={formData.coor_address} onChange={handleChange} />
                </div>
                {user.coor_role === 'Admin' && (
                    <div>
                        <label>Role:</label>
                        <select name="coor_role" value={formData.coor_role} onChange={handleChange}>
                            <option value="Admin">Admin</option>
                            <option value="Coordinator">Coordinator</option>
                        </select>
                    </div>
                )}
                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default Profile;
