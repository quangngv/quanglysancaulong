import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/users/login', { Email: email, Password: password }),
  getProfile: () => api.get('/users/profile')
};

// User API
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`)
};

// Court API
export const courtAPI = {
  getAll: () => api.get('/courts'),
  getById: (id) => api.get(`/courts/${id}`),
  getTypes: () => api.get('/courts/types'),
  getTimeSlots: () => api.get('/courts/timeslots'),
  create: (courtData) => api.post('/courts', courtData),
  update: (id, courtData) => api.put(`/courts/${id}`, courtData),
  delete: (id) => api.delete(`/courts/${id}`)
};

// Booking API
export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { Status: status }),
  cancel: (id) => api.delete(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats')
};

// Payment API
export const paymentAPI = {
  confirm: (bookingId) => api.post(`/payments/confirm/${bookingId}`),
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`)
};

export default api;
