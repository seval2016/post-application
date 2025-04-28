import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface OrderData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  vat: number;
  shipping: number;
  grandTotal: number;
  paymentMethod: string;
  shippingMethod: string;
  status: string;
  notes?: string;
}

// Sipariş oluştur
export const createOrder = async (orderData: OrderData) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  } catch{
    throw new Error('Sipariş oluşturulurken bir hata oluştu');
  }
};

// Tüm siparişleri getir
export const getOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch{
    throw new Error('Siparişler getirilirken bir hata oluştu');
  }
};

// Sipariş detayını getir
export const getOrderById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data;
  } catch{
    throw new Error('Sipariş detayı getirilirken bir hata oluştu');
  }
};

// Sipariş durumunu güncelle
export const updateOrderStatus = async (id: string, status: string) => {
  try {
    console.log(`Sipariş durumu güncelleniyor: ${id} -> ${status}`);
    
    // PATCH yerine PUT kullanarak CORS sorununu aşalım
    const response = await axios.put(`${API_URL}/orders/${id}/status`, { status });
    return response.data;
    
  } catch (error) {
    console.error('Sipariş durumu güncellenirken hata:', error);
    return {
      success: false,
      error: 'Sipariş durumu güncellenirken bir hata oluştu'
    };
  }
}; 