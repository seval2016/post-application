import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios varsayılan ayarları
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.headers.common['Accept'] = 'application/json; charset=utf-8';

export interface Category {
  id: string;
  name: string;
  description?: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

const getCategories = async (): Promise<Category[]> => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await axios.get(`${API_URL}/categories`, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Kategoriler getirilirken hata:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(error.response?.data?.error || 'Kategoriler getirilirken bir hata oluştu');
    }
    throw error;
  }
};

const addCategory = async (category: { name: string; image: string }): Promise<Category> => {
  try {
    console.log('Kategori ekleme isteği gönderiliyor:', category);
    
    const token = localStorage.getItem('token');
    const headers = token ? { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8'
    } : {
      'Content-Type': 'application/json; charset=utf-8'
    };
    
    const response = await axios.post(`${API_URL}/categories`, category, { headers });
    console.log('Kategori eklendi:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Kategori eklenirken hata:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data.error || 'Geçersiz kategori verisi');
      }
      
      throw new Error(error.response?.data?.error || 'Kategori eklenirken bir hata oluştu');
    }
    throw error;
  }
};

const updateCategory = async (id: string, category: { name: string; image: string }): Promise<Category> => {
  try {
    console.log('Kategori güncelleme isteği gönderiliyor:', { id, category });
    
    const token = localStorage.getItem('token');
    const headers = token ? { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8'
    } : {
      'Content-Type': 'application/json; charset=utf-8'
    };
    
    const response = await axios.put(`${API_URL}/categories/${id}`, category, { headers });
    console.log('Kategori güncellendi:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Kategori güncellenirken hata:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 404) {
        throw new Error('Kategori bulunamadı');
      }
      
      throw new Error(error.response?.data?.error || 'Kategori güncellenirken bir hata oluştu');
    }
    throw error;
  }
};

const deleteCategory = async (id: string): Promise<void> => {
  try {
    console.log('Kategori silme isteği gönderiliyor:', id);
    
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await axios.delete(`${API_URL}/categories/${id}`, { headers });
    console.log('Kategori silindi:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Kategori silinirken hata:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 404) {
        throw new Error('Kategori bulunamadı');
      }
      
      throw new Error(error.response?.data?.error || 'Kategori silinirken bir hata oluştu');
    }
    throw error;
  }
};

export const categoryService = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
}; 