// js/authService.js
import { post, get } from './apiService.js';

export const authService = {
  // Register a new user – returns { success, message, userId }
  register: async (userData) => {
    const data = await post('/api/users/register', userData);
    return data; // No token yet – user needs to verify OTP first
  },

  // Login – if 2FA enabled, returns tempToken; otherwise full token & user
  login: async (identifier, password) => {
    const data = await post('/api/users/login', { identifier, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Verify OTP for email verification, login 2FA, or password reset
  verifyOTP: async (email, otp, purpose, tempToken = null) => {
    const body = { email, otp, purpose };
    if (tempToken) body.tempToken = tempToken;

    const data = await post('/api/users/verify-otp', body);
    // If it was a login 2FA, we get a token back
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Forgot password – sends OTP to email
  forgotPassword: async (email) => {
    return await post('/api/users/forgot-password', { email });
  },

  // Reset password using the resetToken from verify-otp
  resetPassword: async (resetToken, newPassword) => {
    return await post('/api/users/reset-password', { resetToken, newPassword });
  },

  // Logout – clear stored data
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get currently logged-in user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in (token exists)
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  }
};