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
      localStorage.setItem('user', JSON.stringify({ ...coordinator, jwt: token })); // Include token in user object

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

//Verifying ols password before updating
export const verifyOldPassword = async (userId, oldPassword) => {
  try {
      const response = await axios.post(`${API_URL}/coordinators/verify-password`, { userId, oldPassword });
      return response.data; 
  } catch (error) {
      console.error('Error verifying old password:', error);
      throw new Error('Failed to verify password. Incorrect');
  }
};

// Function to update the user profile
export const updateProfile = async (userId, updatedData) => {
  try {
      const response = await axios.put(`${API_URL}/coordinators/${userId}`, {
          data: updatedData, // Assuming the backend expects the data to be wrapped in a `data` object
          headers: { Authorization: `Bearer ${getCurrentUser().jwt}` }, // Pass token in headers for authorization
      });
      return response.data; // Assuming response structure returns updated user data
  } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile.'); // Throw error for handling in Profile component
  }
};

// Fetch all users (admin-only access)
export const getUsers = async () => {
  try {
    const token = getCurrentUser().jwt; // Fetch the current user's token
    console.log('Current User Token:', token); // Log the token

    if (!token) {
      throw new Error('User is not authenticated');
    }

    const response = await axios.get(`${API_URL}/coordinators`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data; // Return the fetched user data
  } catch (error) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch users.');
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
  verifyOldPassword,
  getUsers,
};

export default authServices;
