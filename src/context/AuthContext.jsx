import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

const AuthContext = createContext();
const cookies = new Cookies();

const COOKIE_OPTIONS = {
    path: '/',
    maxAge: 18000,
};

export const AuthProvider = ({ children }) => {
    const [user, setUser]   = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!token;

    useEffect(() => {
        const savedToken = cookies.get('token');
        const savedUser  = cookies.get('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        cookies.set('token', userToken, COOKIE_OPTIONS);
        cookies.set('user', userData, COOKIE_OPTIONS);
    };

    // Safe partial update — only patches user fields, never touches token
    const updateUser = (updatedData) => {
        setUser(prev => {
            const merged = { ...prev, ...updatedData };
            cookies.set('user', merged, COOKIE_OPTIONS);
            return merged;
        });
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        cookies.remove('token', { path: '/' });
        cookies.remove('user', { path: '/' });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);