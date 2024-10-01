import React, { createContext, useContext, useState } from 'react';
import authServices from '../services/authServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUserData = localStorage.getItem('user');
            const parsedUser = storedUserData ? JSON.parse(storedUserData) : null;
            console.log("Current User in AuthContext:", parsedUser); // Log for debugging
            return parsedUser;
        } catch (error) {
            console.error("Failed to parse user data from local storage:", error);
            return null;
        }
    });

    const isAdmin = () => {
        return user && user.coordinator && user.coordinator.coor_role === 'Admin';
    };

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
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
