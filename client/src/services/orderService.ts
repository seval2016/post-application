import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Sipariş oluştur
export const createOrder = async (orderData: any) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    throw error;
  }
};

// Tüm siparişleri getir
export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Siparişleri getirme hatası:', error);
    throw error;
  }
};

// Sipariş detayını getir
export const getOrderById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Sipariş detayı getirme hatası:', error);
    throw error;
  }
};

// Sipariş durumunu güncelle
export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const response = await axios.patch(`${API_URL}/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Sipariş durumu güncelleme hatası:', error);
    throw error;
  }
}; 