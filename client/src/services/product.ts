import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Ürünler getirilirken hata:', error);
    throw error;
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
  } catch (error) {
    console.error('Ürün eklenirken hata:', error);
    throw error;
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
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Ürün silinirken hata:', error);
    throw error;
  }
}; 