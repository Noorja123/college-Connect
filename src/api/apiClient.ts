import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

export const apiClient = async (endpoint: string, options: any = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = { ...options.headers };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios({
      url: `${BASE_URL}${endpoint}`,
      method: options.method || 'GET',
      headers,
      data: options.body ? JSON.parse(options.body) : undefined,
    });
    
    // Auto-unwrap the `{ success, message, data }` response wrapper mandated by backend
    return response.data.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'API Request Failed';
    throw new Error(errorMsg);
  }
};
