// src/services/authServices.js
import axios from 'axios';

const API_URL = 'http://localhost:1337/api'; // Adjust if Strapi is hosted elsewhere

// Set authorization token in axios headers
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Register a new coordinator
export const signup = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/coordinators/register`, { data: formData });
    if (response.data.jwt) {
      localStorage.setItem('user', JSON.stringify(response.data)); // Store user data with JWT
      setAuthToken(response.data.jwt); // Set token for future requests
    }
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    const errorMessage = error.response?.data?.error?.message || 'Signup failed. Please try again.';
    throw new Error(errorMessage);
  }
};

// Login a user (coordinator or admin)
export const login = async (identifier, password) => {
  try {
      const response = await axios.post(`${API_URL}/coordinators/login`, { identifier, password });
      const { coordinator, token } = response.data; // Ensure response contains 'coordinator' and 'token'

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ coordinator })); // Store 'coordinator' in user

      setAuthToken(token); // Set token for future requests
      return { coordinator, token }; // Return structured data
  } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
  }
};

// Logout a user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setAuthToken(null); // Clear token from headers
};

// Get current authenticated user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if a user is authenticated by checking the presence of a token
export const isAuthenticated = () => {
  const user = getCurrentUser();
  return user && user.jwt ? true : false;
};

// Get the user profile by ID
export const getProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/coordinators/${userId}`, {
      headers: { Authorization: `Bearer ${getCurrentUser().jwt}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Failed to fetch profile data');
  }
};

// Update the user profile and password
export const updateProfile = async (userId, profileData) => {
  const { currentPassword, newPassword } = profileData;
  const user = getCurrentUser();
  const token = user?.jwt; // Ensure you're getting the correct token

  if (!token) {
    throw new Error('User not authenticated'); // Handle case where token is missing
  }

  try {
    // Update password if provided
    if (currentPassword && newPassword) {
      // Validate current password first (optional, depending on your design)
      const response = await axios.put(`${API_URL}/coordinators/${userId}/password`, {
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the token in headers
        },
      });

      // Ensure the password update was successful before proceeding
      if (response.status !== 200) {
        throw new Error('Password update failed');
      }
    }

    // Now update the user profile
    const response = await axios.put(`${API_URL}/coordinators/${userId}`, { data: profileData }, {
      headers: {
        Authorization: `Bearer ${token}`, // Set the token in headers
      },
    });

    return response.data; // Return response data as needed
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error(error.response?.data?.message || 'Profile update failed');
  }
};

// Export all services
const authServices = {
  signup,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  getProfile,
  updateProfile,
  setAuthToken,
};

export default authServices;
