// js/complaintService.js
import { get, post, put } from './apiService.js';

export const complaintService = {
  // Submit a new complaint (with optional file attachment)
  postComplaint: async (formData) => {
    return await post('/api/complaints', formData, true); // true = isFormData
  },

  // Admin: get all complaints (student info populated)
  getAllComplaints: async () => {
    return await get('/api/complaints');
  },

  // Student: get only the logged‑in user's complaints
  getMyComplaints: async () => {
    return await get('/api/complaints/mine');
  },

  // Get a single complaint by ID
  getComplaintById: async (id) => {
    return await get(`/api/complaints/${id}`);
  },

  // Add feedback (student or admin reply)
  addFeedback: async (id, message, sender) => {
    return await post(`/api/complaints/${id}/feedback`, { message, sender });
  },

  // Mark complaint as resolved
  markAsResolved: async (id) => {
    return await put(`/api/complaints/${id}/resolve`);
  },

  // Resend a pending complaint
  resendComplaint: async (id) => {
    return await post(`/api/complaints/${id}/resend`);
  }
};