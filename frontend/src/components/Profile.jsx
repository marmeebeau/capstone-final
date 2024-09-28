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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('No token found. Please log in again.');
            return;
        }

        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            console.log('Token Expiry Time:', decodedToken.exp);
            console.log('Current Time:', currentTime);

            if (decodedToken.exp < currentTime) {
                setErrorMessage('Your session has expired. Please refresh the page or log in again.');
                return; // No logout or redirection, just show the error
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            setErrorMessage('Invalid token. Please log in again.');
            return;
        }

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
    }, []);

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

        const token = localStorage.getItem('token');
        // alert(token);

        if (!token) {
            setErrorMessage('No token found. Please log in again.');
            setLoading(false);
            return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
            setErrorMessage('Your session has expired. Please refresh the page or log in again.');
            setLoading(false);
            return; // No logout, just show the error
        }

        try {
            // authServices.setAuthToken(token); // Ensure token is included in requests
            const response = await authServices.updateProfile(user.id, formData);
            // const response = await axios.put(
            //     `http://localhost:1337/api/coordinators/${user.id}`,
            //     { data: formData },
            //     {
            //         headers: {
            //             Authorization: `Bearer ${token}`, // Include token in headers
            //         },
            //     }
            // );

            setUser(response);
            const userdata = {
                coordinator: response
            };
            localStorage.setItem('user', JSON.stringify(userdata));
            setSuccessMessage('Profile updated successfully!');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Unauthorized access.');
            } else {
                setErrorMessage(error.message || 'An error occurred. Please try again.');
            }
        } finally {
            setLoading(false); // Stop loading spinner or disable state
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
