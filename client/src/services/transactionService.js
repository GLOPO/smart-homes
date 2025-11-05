/* eslint-disable no-useless-catch */
// services/transactionService.js (Frontend)
import axios from 'axios';

// Environment-aware API URL
// Development: Uses Vite proxy (relative path)
// Production: Uses environment variable or your deployed backend URL
const getApiUrl = () => {
  // If in production, use the production API URL
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://your-backend-domain.com/api';
  }
  // In development, use proxy (relative path)
  return '/api';
};

const API_URL = getApiUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Important for cookies if you use them
});

// Add token to requests - Check multiple storage locations
api.interceptors.request.use(
  (config) => {
    // Try to get token from multiple sources
    let token = localStorage.getItem('token') || 
                localStorage.getItem('access_token') ||
                sessionStorage.getItem('token');
    
    // If no token in storage, try to get from Redux or Context
    // You might need to adjust this based on your state management
    if (!token) {
      // Check if you have a user state with token
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          token = user.token || user.accessToken;
        } catch (e) {
          console.error('Error parsing currentUser:', e);
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No authentication token found');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized - Token may be invalid or expired');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Get transaction history
export const getTransactionHistory = async (filters = {}) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = filters;
    const response = await api.get('/transactions/history', {
      params: { page, limit, status, startDate, endDate }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Initialize payment
export const initializePayment = async (paymentData) => {
  try {
    const response = await api.post('/transactions/initialize', paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify payment
export const verifyPayment = async (reference) => {
  try {
    const response = await api.get(`/transactions/verify/${reference}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Sync transactions from Paystack
export const syncTransactions = async (email) => {
  try {
    const response = await api.post('/transactions/sync', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get transaction stats
export const getTransactionStats = async () => {
  try {
    const response = await api.get('/transactions/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};