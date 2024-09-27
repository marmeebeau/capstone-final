import axios from 'axios';

const API_URL = 'http://localhost:1337/api'; 

// Function to set the authorization token in axios headers
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
      localStorage.setItem('user', JSON.stringify(response.data)); // Store user info with JWT
      setAuthToken(response.data.jwt); // Set the token for future requests
    }
    return response.data;
  } catch (error) {
      console.error('Signup error:', error); // Log the entire error object
      // Ensure to access the error response and get a meaningful message
      const errorMessage = error.response?.data?.error?.message || 'Signup failed. Please try again.';
      throw new Error(errorMessage); // Ensure this throws a string message
    }
};


// Login a user (coordinator or admin)
export const login = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_URL}/coordinators/login`, {
      identifier,
      password,
    });

        // Extract and log the token
        const { token } = response.data; // Adjust according to your response structure
        console.log('Retrieved token:', token); // Check if token is retrieved

        // Store the token in localStorage after successful login
        localStorage.setItem('token', response.data.token); // Save token to local storage
        localStorage.setItem('user', JSON.stringify(response.data)); // Save user data
        
        // Set token in Axios headers for future requests
        setAuthToken(token);

        return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed. Please check your credentials.');
}
};

// Logout a user by removing the token from localStorage
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setAuthToken(null); // Clear the authorization token

};

// Get the current authenticated user from localStorage
const getCurrentUser = () => {
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
      headers: {
        Authorization: `Bearer ${getCurrentUser().jwt}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Failed to fetch profile data');
  }
};

// Update the user profile
const updateProfile = async (userId, profileData) => {
  try {
      const response = await axios.put(`${API_URL}/coordinators/${userId}`, { data: profileData });
      return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
    throw new Error(errorMessage); // Optionally throw the error
  }
};

// Export all authentication services including new ones
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

// Optionally expose it to the global window object for console access
window.authServices = authServices;

export default authServices;