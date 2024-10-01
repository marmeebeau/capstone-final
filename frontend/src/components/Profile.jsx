import React, { useState, useEffect } from 'react';
import authServices from '../services/authServices';

const Profile = () => {
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({
        coor_fname: '',
        coor_lname: '',
        coor_username: '',
        coor_email: '',
        coor_contact: '',
        coor_address: '',
        coor_role: '',
        old_password: '',  
        new_password: '',
        confirm_password: ''
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

        // Decode token to check expiration
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode token to check expiration
            const currentTime = Math.floor(Date.now() / 1000);

            if (decodedToken.exp < currentTime) {
                setErrorMessage('Your session has expired. Please refresh the page or log in again.');
                return;
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            setErrorMessage('Invalid token. Please log in again.');
            return;
        }

        const currentUser = authServices.getCurrentUser(); // Fetch user data from local storage or state
        if (currentUser && currentUser.coordinator) {
            setUser(currentUser.coordinator);
            setFormData({
                coor_fname: currentUser.coordinator.coor_fname || '',
                coor_lname: currentUser.coordinator.coor_lname || '',
                coor_username: currentUser.coordinator.coor_username || '',
                coor_email: currentUser.coordinator.coor_email || '',
                coor_contact: currentUser.coordinator.coor_contact || '',
                coor_address: currentUser.coordinator.coor_address || '',
                coor_role: currentUser.coordinator.coor_role || '',
                old_password: '', 
                new_password: '',  
                confirm_password: '' 
            });
        } else {
            setErrorMessage('User not found. Please log in again.');
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

        const { old_password, new_password, confirm_password } = formData;

        // Validate password match
        if (new_password && new_password !== confirm_password) {
            setErrorMessage('Passwords do not match.');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('No token found. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            // Verify the old password
            const verifyResponse = await authServices.verifyOldPassword(user.id, old_password);
            if (!verifyResponse.success) {
                setErrorMessage('Old password is incorrect.');
                setLoading(false);
                return;
            }

            // Prepare updated form data
            const updatedFormData = { ...formData };
            if (new_password) {
                updatedFormData.coor_password = new_password; // Update to new password
            }

            // Update user profile with new data
            const response = await authServices.updateProfile(user.id, updatedFormData);
            setUser(response); // Update the user state with the response
            localStorage.setItem('user', JSON.stringify({ coordinator: response })); // Store updated user data in local storage
            setSuccessMessage('Profile updated successfully!');
        } catch (error) {
            setErrorMessage(error.message || 'An error occurred. Please try again.');
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
                <div>
                    <label>Old Password:</label>
                    <input type="password" name="old_password" value={formData.old_password} onChange={handleChange} required />
                </div>
                <div>
                    <label>New Password:</label>
                    <input type="password" name="new_password" value={formData.new_password} onChange={handleChange} />
                </div>
                <div>
                    <label>Confirm New Password:</label>
                    <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} />
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
