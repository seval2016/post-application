import axios from 'axios';
import { Category } from '../types/category';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174/api';

// Axios instance oluştur
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Request interceptor ekle
axiosInstance.interceptors.request.use(
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

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await axiosInstance.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  addCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
      const response = await axiosInstance.post('/categories', category);
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    try {
      const response = await axiosInstance.put(`/categories/${id}`, category);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}; 