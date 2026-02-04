import axios from 'axios';

// Configure the base URL for the backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token from environment variable
    const token = import.meta.env.VITE_JWT_TOKEN || process.env.REACT_APP_JWT_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - check JWT token in .env file');
      // Note: Token is now from .env, so no need to remove from localStorage
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  // Tasks API methods
  async getTasks() {
    const response = await api.get('/tasks');
    return response.data;
  },

  async getTask(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Zadania API (Simulation of external API tasks)
  async getApiTasks() {
    try {
      const response = await api.get('/tasks?is_api_task=true');
      return response.data;
    } catch (error) {
      console.error('Error fetching API tasks:', error);
      return [];
    }
  },

  async createApiTask(taskData) {
    const response = await api.post('/tasks', {
      ...taskData,
      is_api_task: true
    });
    return response.data;
  },

  async updateApiTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Auth API methods (if needed)
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Users API
  async getUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback for demo purposes if backend doesn't have /users yet
      return [
        { id: 1, email: 'admin@example.com', full_name: 'Administrator' },
        { id: 2, email: 'user@example.com', full_name: 'Użytkownik Testowy' }
      ];
    }
  },

  // Comments API
  async getComments(taskId) {
    try {
      const response = await api.get(`/tasks/${taskId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return []; // Return empty array if not implemented
    }
  },

  async addComment(taskId, commentData) {
    const response = await api.post(`/tasks/${taskId}/comments`, commentData);
    return response.data;
  },
};

export default ApiService;