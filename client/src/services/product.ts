import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174/api';

export interface Product {
  _id: string;
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description?: string;
}

interface ApiResponse {
  _id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    
    if (!Array.isArray(response.data)) {
      throw new Error('API yanıtı geçersiz format');
    }
    
    const productsWithId = response.data.map((product: ApiResponse) => ({
      ...product,
      id: product._id
    }));
    return productsWithId;
  } catch{
    throw new Error('Ürünler getirilirken bir hata oluştu');
  }
};

export const addProduct = async (productData: Omit<Product, '_id'>): Promise<Product> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch{
    throw new Error('Ürün eklenirken bir hata oluştu');
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/products/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch{
    throw new Error('Ürün güncellenirken bir hata oluştu');
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch{
    throw new Error('Ürün silinirken bir hata oluştu');
  }
}; 