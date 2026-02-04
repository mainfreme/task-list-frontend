import axios from 'axios';

// Configure the base URL for the backend API
// Endpoints include /v1/ prefix, so base URL should be /api without version
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = import.meta.env.VITE_JWT_TOKEN;
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
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  // =====================
  // Tasks API - /v1/tasks
  // =====================
  
  /**
   * List tasks with optional filters
   * GET /v1/tasks
   * @param {Object} params - { page, per_page, status, application_manager_id }
   */
  async getTasks(params = {}) {
    const response = await api.get('/v1/tasks', { params });
    return response.data;
  },

  /**
   * Get task details
   * GET /v1/tasks/{id}
   */
  async getTask(id) {
    const response = await api.get(`/v1/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task
   * POST /v1/tasks
   * Required: title, website_url, description, address
   * Optional: phone, email, due_date, delivery_address
   */
  async createTask(taskData) {
    const response = await api.post('/v1/tasks', taskData);
    return response.data;
  },

  /**
   * Update task
   * PUT /v1/tasks/{id}
   */
  async updateTask(id, taskData) {
    const response = await api.put(`/v1/tasks/${id}`, taskData);
    return response.data;
  },

  /**
   * Delete task
   * DELETE /v1/tasks/{id}
   */
  async deleteTask(id) {
    const response = await api.delete(`/v1/tasks/${id}`);
    return response.data;
  },

  /**
   * Update task status
   * PATCH /v1/tasks/{id}/status
   * @param {string} id - Task UUID
   * @param {string} status - pending | in_progress | completed | cancelled
   */
  async updateTaskStatus(id, status) {
    const response = await api.patch(`/v1/tasks/${id}/status`, { status });
    return response.data;
  },

  // =====================
  // Application Managers API - /v1/applications
  // =====================

  /**
   * List Application Managers
   * GET /v1/applications
   * @param {Object} params - { is_active }
   */
  async getApplications(params = {}) {
    const response = await api.get('/v1/applications', { params });
    return response.data;
  },

  /**
   * Get Application Manager details
   * GET /v1/applications/{id}
   */
  async getApplication(id) {
    const response = await api.get(`/v1/applications/${id}`);
    return response.data;
  },

  /**
   * Create Application Manager
   * POST /v1/applications
   * Required: name
   * Optional: request_url, is_active, ip_whitelist
   */
  async createApplication(data) {
    const response = await api.post('/v1/applications', data);
    return response.data;
  },

  /**
   * Update Application Manager
   * PUT /v1/applications/{id}
   */
  async updateApplication(id, data) {
    const response = await api.put(`/v1/applications/${id}`, data);
    return response.data;
  },

  /**
   * Generate API Key for Application Manager
   * POST /v1/applications/{id}/generate-api-key
   */
  async generateApiKey(id) {
    const response = await api.post(`/v1/applications/${id}/generate-api-key`);
    return response.data;
  },

  /**
   * Generate JWT Token for Application Manager
   * POST /v1/applications/{id}/generate-jwt-token
   * @param {string} id - Application Manager UUID
   * @param {number} expirationMinutes - Token expiration in minutes (optional)
   */
  async generateJwtToken(id, expirationMinutes = null) {
    const data = expirationMinutes ? { expiration_minutes: expirationMinutes } : {};
    const response = await api.post(`/v1/applications/${id}/generate-jwt-token`, data);
    return response.data;
  },

  // =====================
  // CRM API - /v1/crm
  // =====================

  /**
   * List all CRM clients
   * GET /v1/crm
   */
  async getCrmClients() {
    const response = await api.get('/v1/crm');
    return response.data;
  },

  /**
   * Get CRM client by ID
   * GET /v1/crm/{id}
   */
  async getCrmClient(id) {
    const response = await api.get(`/v1/crm/${id}`);
    return response.data;
  },

  /**
   * Create a new CRM client
   * POST /v1/crm
   * Required: name, email
   */
  async createCrmClient(data) {
    const response = await api.post('/v1/crm', data);
    return response.data;
  },

  /**
   * Update CRM client
   * PUT /v1/crm/{id}
   */
  async updateCrmClient(id, data) {
    const response = await api.put(`/v1/crm/${id}`, data);
    return response.data;
  },

  /**
   * Delete CRM client
   * DELETE /v1/crm/{id}
   */
  async deleteCrmClient(id) {
    const response = await api.delete(`/v1/crm/${id}`);
    return response.data;
  },

  // =====================
  // Legacy/Compatibility methods
  // =====================

  /**
   * Get API tasks (filtered)
   * @deprecated Use getTasks({ application_manager_id }) instead
   */
  async getApiTasks() {
    try {
      const response = await api.get('/v1/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching API tasks:', error);
      return [];
    }
  },

  /**
   * Create API task
   * @deprecated Use createTask() instead
   */
  async createApiTask(taskData) {
    const response = await api.post('/v1/tasks', taskData);
    return response.data;
  },

  /**
   * Update API task
   * @deprecated Use updateTask() instead
   */
  async updateApiTask(id, taskData) {
    const response = await api.put(`/v1/tasks/${id}`, taskData);
    return response.data;
  },
};

export default ApiService;
