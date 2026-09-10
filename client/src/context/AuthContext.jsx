import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Show Toast helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('taskflow_token');
      const storedUser = localStorage.getItem('taskflow_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch (e) {
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: resToken, user: resUser } = response.data;

      localStorage.setItem('taskflow_token', resToken);
      localStorage.setItem('taskflow_user', JSON.stringify(resUser));

      setToken(resToken);
      setUser(resUser);
      showToast('Welcome back, ' + resUser.name + '!', 'success');

      return { success: true, user: resUser };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout,
    toast,
    showToast
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
