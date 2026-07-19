// js/userService.js
import { get, put } from './apiService.js';

export const userService = {
  // Get current user details
  getUserInfo: async () => {
    return await get('/api/users/me');
  },

  // Update profile – can be password, profile picture, or both
  // Pass FormData if uploading a file, else a plain object.
  updateProfile: async (formDataOrObject, isFormData = false) => {
    return await put('/api/users/update', formDataOrObject, isFormData);
  },

  // Toggle two-factor authentication
  toggleTwoFactor: async () => {
    return await put('/api/users/toggle-2fa');
  }
};