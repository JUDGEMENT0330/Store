import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const { data } = await api.post('/auth/login', { email, password }, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return data; // Return user data on successful login
        } catch (error) {
            console.error('Login failed:', error);
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const isAdmin = user && user.rol === 'admin';

    return (
        <UserContext.Provider value={{ user, loading, login, logout, isAdmin }}>
            {children}
        </UserContext.Provider>
    );
};