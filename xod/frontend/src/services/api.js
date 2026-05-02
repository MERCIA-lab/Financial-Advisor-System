import axios from 'axios';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_BASE_URL = rawApiBaseUrl.endsWith('/api')
  ? rawApiBaseUrl
  : `${rawApiBaseUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const clientService = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (client) => api.post('/clients', client),
  update: (id, client) => api.put(`/clients/${id}`, client),
  delete: (id) => api.delete(`/clients/${id}`),
};

export const securityService = {
  getByClientId: (clientId) => api.get(`/clients/${clientId}/securities`),
  create: (clientId, security) => api.post(`/clients/${clientId}/securities`, security),
  update: (id, security) => api.put(`/clients/securities/${id}`, security),
  delete: (id) => api.delete(`/clients/securities/${id}`),
};

export default api;