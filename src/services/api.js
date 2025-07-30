// API service for Virtual Object Placer
// This file handles all communication with the backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  // User profile endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(updates) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Project endpoints
  async getProjects() {
    return this.request('/projects');
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  }

  async updateProject(id, updates) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  async deleteProject(id) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE'
    });
  }

  // Image processing endpoints
  async processImage(imageFile, type = 'object') {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('type', type);

    return this.request('/process-image', {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeaders().Authorization
      },
      body: formData
    });
  }

  async placeObject(roomImage, objectImage, position) {
    return this.request('/place-object', {
      method: 'POST',
      body: JSON.stringify({
        roomImage,
        objectImage,
        position
      })
    });
  }

  // Subscription endpoints
  async getSubscription() {
    return this.request('/subscription');
  }

  async upgradeSubscription(planId) {
    return this.request('/subscription/upgrade', {
      method: 'POST',
      body: JSON.stringify({ planId })
    });
  }

  async cancelSubscription() {
    return this.request('/subscription/cancel', {
      method: 'POST'
    });
  }

  // Usage tracking
  async getUsage() {
    return this.request('/usage');
  }

  // File upload
  async uploadFile(file, type = 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/upload', {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeaders().Authorization
      },
      body: formData
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;