import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
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

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  
  register: (userData) => api.post('/auth/register', userData),
  
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (userData) => api.put('/auth/profile', userData),
  
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
  
  uploadProfileImage: (formData) => api.post('/auth/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  deleteProfileImage: () => api.delete('/auth/profile/image'),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  
  getById: (id) => api.get(`/products/${id}`),
  
  getCategories: () => api.get('/products/categories'),
  
  getFavorites: () => api.get('/products/favorites'),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  
  addItem: (item) => api.post('/cart/items', item),
  
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  
  clearCart: () => api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  
  getAll: (params) => api.get('/orders', { params }),
  
  getById: (id) => api.get(`/orders/${id}`),
  
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Payments API
export const paymentsAPI = {
  processPayment: (paymentData) => api.post('/payments', paymentData),
  
  getPaymentStatus: (orderId) => api.get(`/payments/status/${orderId}`),
};

// Feedback API
export const feedbackAPI = {
  submit: (feedbackData) => api.post('/feedback', feedbackData),
  
  getByOrder: (orderId) => api.get(`/feedback/order/${orderId}`),
};

// Analytics API
export const analyticsAPI = {
  getUserFavorites: () => api.get('/analytics/favorites'),
  
  getOrderStats: () => api.get('/analytics/orders'),
  
  getPopularProducts: () => api.get('/analytics/popular-products'),
};

// Admin API
export const adminAPI = {
  // Products management
  createProduct: (productData) =>
    api.post('/admin/products', productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updateProduct: (id, productData) =>
    api.put(`/admin/products/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // Orders management
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  
  // Customers management
  getAllCustomers: () => api.get('/admin/customers'),
  
  getCustomerDetails: (id) => api.get(`/admin/customers/${id}`),
  
  // Analytics
  getDashboardStats: () => api.get('/admin/analytics/dashboard'),
  
  getSalesAnalytics: (params) => api.get('/admin/analytics/sales', { params }),
  
  getCustomerAnalytics: () => api.get('/admin/analytics/customers'),
  
  getFeedbackAnalytics: () => api.get('/admin/analytics/feedback'),
};

export default api;