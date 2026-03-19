import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add admin token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
};

// Product APIs
export const productAPI = {
  getAll: () => api.get('/products'),
  add: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/products/${id}`),
};

// Order APIs
export const orderAPI = {
  getAll: () => api.get('/orders/all'),
  updateStatus: (id, status) => api.put(`/orders/status/${id}`, { status }),
};

export default api;
