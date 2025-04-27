import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174/api';

export interface Category {
  id: string;
  name: string;
  description?: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Kategoriler yüklenirken hata oluştu:', error);
    throw error;
  }
};

export const addCategory = async (categoryData: { name: string; image: string }): Promise<Category> => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await axios.post(`${API_URL}/categories`, categoryData, { headers });
    return response.data;
  } catch (error) {
    console.error('Kategori eklenirken hata oluştu:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, categoryData: { name: string; image: string }): Promise<Category> => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await axios.put(`${API_URL}/categories/${id}`, categoryData, { headers });
    return response.data;
  } catch (error) {
    console.error('Kategori güncellenirken hata oluştu:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    await axios.delete(`${API_URL}/categories/${id}`, { headers });
  } catch (error) {
    console.error('Kategori silinirken hata oluştu:', error);
    throw error;
  }
}; 