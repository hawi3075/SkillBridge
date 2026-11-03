/**
 * SkillBridge Centralized API Service Client
 * Handles Axios configuration, JWT token injection, error handling, and typed endpoints.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors and handle 401s
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, clean stale token
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// 1. Auth API
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  updatePassword: (currentPassword, newPassword) => api.put('/auth/update-password', { currentPassword, newPassword })
};

// 2. Users API
export const userApi = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteAccount: () => api.delete('/users/account')
};

// 3. Skills & Categories API
export const skillApi = {
  getCategories: () => api.get('/skills/categories'),
  createCategory: (data) => api.post('/skills/categories', data),
  updateCategory: (id, data) => api.put(`/skills/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/skills/categories/${id}`),

  getSkills: (params) => api.get('/skills', { params }),
  getSkillBySlug: (slug) => api.get(`/skills/detail/${slug}`),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),

  getMySkills: () => api.get('/skills/user/my-skills'),
  addOfferedSkill: (data) => api.post('/skills/user/offered', data),
  removeOfferedSkill: (skillId) => api.delete(`/skills/user/offered/${skillId}`),
  addWantedSkill: (data) => api.post('/skills/user/wanted', data),
  removeWantedSkill: (skillId) => api.delete(`/skills/user/wanted/${skillId}`)
};

// 4. Smart Matching API
export const matchApi = {
  getMatches: () => api.get('/matches'),
  getMatchWithUser: (targetUserId) => api.get(`/matches/${targetUserId}`)
};

// 5. Exchange Requests API
export const exchangeApi = {
  getExchanges: (params) => api.get('/exchanges', { params }),
  getExchangeById: (id) => api.get(`/exchanges/${id}`),
  sendRequest: (data) => api.post('/exchanges', data),
  acceptExchange: (id) => api.put(`/exchanges/${id}/accept`),
  rejectExchange: (id) => api.put(`/exchanges/${id}/reject`),
  completeExchange: (id) => api.put(`/exchanges/${id}/complete`),
  cancelExchange: (id) => api.put(`/exchanges/${id}/cancel`)
};

// 6. Sessions API
export const sessionApi = {
  getSessions: (params) => api.get('/sessions', { params }),
  getSessionById: (id) => api.get(`/sessions/${id}`),
  createSession: (data) => api.post('/sessions', data),
  updateSession: (id, data) => api.put(`/sessions/${id}`, data),
  deleteSession: (id) => api.delete(`/sessions/${id}`)
};

// 7. Chat API
export const chatApi = {
  getConversations: () => api.get('/messages/conversations'),
  startDirect: (targetUserId) => api.post('/messages/conversations/direct', { targetUserId }),
  getMessages: (conversationId) => api.get(`/messages/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, content) => api.post(`/messages/conversations/${conversationId}/messages`, { content })
};

// 8. Reviews API
export const reviewApi = {
  createReview: (data) => api.post('/reviews', data),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
  moderateReview: (id, isModerated) => api.put(`/reviews/${id}/moderate`, { isModerated }),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};

// 9. Notifications API
export const notificationApi = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/mark-all-read')
};

// 10. Admin API
export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, data) => api.put(`/admin/users/${id}/status`, data),
  getReports: (params) => api.get('/admin/reports', { params }),
  createReport: (data) => api.post('/admin/reports', data),
  updateReportStatus: (id, data) => api.put(`/admin/reports/${id}/status`, data)
};

export default api;
