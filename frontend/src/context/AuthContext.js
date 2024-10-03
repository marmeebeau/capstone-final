import React, { createContext, useContext, useState } from 'react';
import authServices from '../services/authServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUserData = localStorage.getItem('user');
            console.log("Stored User Data in localStorage:", storedUserData); // Log for debugging
            return storedUserData ? JSON.parse(storedUserData) : null;
        } catch (error) {
            console.error("Failed to parse user data from local storage:", error);
            return null;
        }
    });

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log("User logged out"); // Log for debugging
    };

    const login = async (identifier, password) => {
        try {
            const { user, token } = await authServices.login(identifier, password);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            console.log("User logged in:", user); // Log for debugging
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Allow the calling component to handle the error
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
