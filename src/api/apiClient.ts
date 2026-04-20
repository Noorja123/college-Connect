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
    
    // Advanced robust unwrap:
    // If backend returns { success: true, data: [...] } format, extract `data`.
    // If backend is still running old deployment returning an array `[{...}]`, return it directly.
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.message || 'API Request Failed';
    throw new Error(errorMsg);
  }
};
