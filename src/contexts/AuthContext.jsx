import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import ApiService from '../services/ApiService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          const response = await ApiService.getMe();
          setUser(response.user);
          setToken(storedToken);
        } catch (err) {
          // Token is invalid, clear it
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.login(email, password);
      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('auth_token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, passwordConfirmation) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.register(name, email, password, passwordConfirmation);
      const { token: newToken, user: userData } = response;
      
      localStorage.setItem('auth_token', newToken);
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.errors || 'Registration failed';
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await ApiService.logout();
    } catch (err) {
      // Ignore logout errors, clear local state anyway
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
