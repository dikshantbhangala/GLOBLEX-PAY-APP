import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  addFunds: (amount, currency) => api.post('/wallet/add-funds', { amount, currency }),
  withdraw: (amount, currency, bankDetails) => api.post('/wallet/withdraw', { amount, currency, bankDetails }),
  sendMoney: (recipientEmail, amount, currency) => api.post('/wallet/send', { recipientEmail, amount, currency }),
  getTransactions: (page = 1, limit = 20) => api.get(`/transactions?page=${page}&limit=${limit}`),
};

export const kycAPI = {
  submitKYC: (formData) => api.post('/kyc/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getKYCStatus: () => api.get('/kyc/status'),
};

export const currencyAPI = {
  getExchangeRates: () => api.get('/currency/rates'),
  convertCurrency: (from, to, amount) => api.get(`/currency/convert?from=${from}&to=${to}&amount=${amount}`),
};

export default api;