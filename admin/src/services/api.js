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

// Restaurant APIs (used in Restaurants.jsx admin page)
export const restaurantAPI = {
  // List & detail
  getAll:  (cuisine, search) => {
    const params = new URLSearchParams();
    if (cuisine && cuisine !== 'All') params.append('cuisine', cuisine);
    if (search && search.trim()) params.append('search', search.trim());
    return api.get(`/restaurants?${params.toString()}`);
  },
  getById: (id)       => api.get(`/restaurants/${id}`),

  // Restaurant CRUD
  create:  (data)     => api.post('/restaurants', data),
  update:  (id, data) => api.put(`/restaurants/${id}`, data),
  delete:  (id)       => api.delete(`/restaurants/${id}`),

  // Menu Section CRUD
  addSection:    (id, data)             => api.post(`/restaurants/${id}/sections`, data),
  updateSection: (id, sectionId, data)  => api.put(`/restaurants/${id}/sections/${sectionId}`, data),
  deleteSection: (id, sectionId)        => api.delete(`/restaurants/${id}/sections/${sectionId}`),

  // Menu Item CRUD
  addItem:    (id, sectionId, data)           => api.post(`/restaurants/${id}/sections/${sectionId}/items`, data),
  updateItem: (id, sectionId, itemId, data)   => api.put(`/restaurants/${id}/sections/${sectionId}/items/${itemId}`, data),
  deleteItem: (id, sectionId, itemId)         => api.delete(`/restaurants/${id}/sections/${sectionId}/items/${itemId}`),
};

export default api;
