import axios from 'axios';
import { Category } from '../types/category';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174/api';

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch{
    throw new Error('Kategoriler yüklenirken bir hata oluştu');
  }
};

export const addCategory = async (categoryData: { name: string; image: string }): Promise<Category> => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await axios.post(`${API_URL}/categories`, categoryData, { headers });
    return response.data;
  } catch{
    throw new Error('Kategori eklenirken bir hata oluştu');
  }
};

export const updateCategory = async (id: string, categoryData: { name: string; image: string }): Promise<Category> => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await axios.put(`${API_URL}/categories/${id}`, categoryData, { headers });
    return response.data;
  } catch{
    throw new Error('Kategori güncellenirken bir hata oluştu');
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    await axios.delete(`${API_URL}/categories/${id}`, { headers });
  } catch{
    throw new Error('Kategori silinirken bir hata oluştu');
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error('Kategoriler yüklenirken bir hata oluştu');
    }
    return await response.json();
  } catch (error) {
    console.error('Kategoriler yüklenirken hata:', error);
    throw error;
  }
}; 