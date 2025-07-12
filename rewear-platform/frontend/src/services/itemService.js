import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
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

const itemService = {
  // Get all items with filters
  getItems: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/items?${params.toString()}`);
    return response.data;
  },

  // Get single item by ID
  getItem: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // Create new item
  createItem: async (itemData) => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  // Update item
  updateItem: async (id, itemData) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  // Delete item
  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },

  // Like/unlike item
  toggleLike: async (id) => {
    const response = await api.post(`/items/${id}/like`);
    return response.data;
  },

  // Get user's items
  getUserItems: async () => {
    const response = await api.get('/items/user/me');
    return response.data;
  },

  // Get all items (alias for getItems)
  getAllItems: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/items?${params.toString()}`);
    return response.data;
  },

  // Get my items (alias for getUserItems)
  getMyItems: async () => {
    const response = await api.get('/items/user/me');
    return response.data;
  }
};

export default itemService; 