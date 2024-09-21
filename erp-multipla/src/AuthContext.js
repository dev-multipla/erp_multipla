// src/AuthContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    userName: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [userName, setUserName] = useState(null);

    const login = (token, userName) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setToken(token);
        setUserName(userName);
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await axios.post('http://127.0.0.1:8000/api/logout/', { refresh_token: refreshToken });
            }
        } catch (error) {
            console.error('Erro ao fazer logout no backend:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            setIsLoggedIn(false);
            setToken(null);
            setUserName(null);
            window.location.href = '/';
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};