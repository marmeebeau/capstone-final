// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import authServices from '../services/authServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUserData = localStorage.getItem('user');
            console.log("Stored User Data:", storedUserData); // Debugging log

            // Only parse if storedUserData is defined
            return storedUserData ? JSON.parse(storedUserData) : null; 
        } catch (error) {
            console.error("Failed to parse user data from local storage:", error);
            return null; // Return null if there was an error
        }
    });

    const login = async (identifier, password) => {
        try {
            const { user, token } = await authServices.login(identifier, password);
            setUser(user); // Set user data in state
            localStorage.setItem('token', token); // Store token in local storage
            localStorage.setItem('user', JSON.stringify(user)); // Store user in local storage
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Rethrow the error for handling in the component
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Remove user from local storage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
