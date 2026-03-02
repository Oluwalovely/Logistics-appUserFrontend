import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

const AuthContext = createContext();
const cookies = new Cookies();

const COOKIE_OPTIONS = {
    path: '/',
    maxAge: 18000, // 5 hours in seconds — matches JWT expiresIn: "5h"
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!token;

    // ─── Load user from cookies on app start ──────────────────
    useEffect(() => {
        const savedToken = cookies.get('token');
        const savedUser = cookies.get('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    // ─── Login ────────────────────────────────────────────────
    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        cookies.set('token', userToken, COOKIE_OPTIONS);
        cookies.set('user', userData, COOKIE_OPTIONS);
    };

    // ─── Logout ───────────────────────────────────────────────
    const logout = () => {
        setUser(null);
        setToken(null);
        cookies.remove('token', { path: '/' });
        cookies.remove('user', { path: '/' });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);