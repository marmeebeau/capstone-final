import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import authServices from '../services/authServices';

const SignUp = () => {
  const [formData, setFormData] = useState({
    coor_fname: '',
    coor_lname: '',
    coor_username: '',
    coor_email: '',
    coor_password: '',
    coor_contact: '',
    coor_address: '',
    coor_role: 'Coordinator',
  });

  const navigate = useNavigate(); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted
    console.log("Submitting form data:", formData); // Debugging line
    try {
      await authServices.signup(formData);
      setSuccess('Sign up successful! Redirecting to login...');
      setError(null);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error during signup:', error);
      setError(error.message || 'An unexpected error occurred.');
      setSuccess(null);
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="coor_fname"
          value={formData.coor_fname}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="coor_lname"
          value={formData.coor_lname}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <input
          type="text"
          name="coor_username"
          value={formData.coor_username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="coor_email"
          value={formData.coor_email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="coor_password"
          value={formData.coor_password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="text"
          name="coor_contact"
          value={formData.coor_contact}
          onChange={handleChange}
          placeholder="Contact Number"
        />
        <textarea
          name="coor_address"
          value={formData.coor_address}
          onChange={handleChange}
          placeholder="Address"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;