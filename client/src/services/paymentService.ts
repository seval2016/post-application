import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174/api';

export interface InstallmentOption {
  value: number;
  label: string;
  monthlyPayment: number;
  totalPayment: number;
  interestRate?: number;
}

export const getInstallmentOptions = async (cardNumber: string, amount: number): Promise<InstallmentOption[]> => {
  try {
    const response = await axios.get(`${API_URL}/payments/installments`, {
      params: {
        cardNumber,
        amount
      }
    });
    return response.data;
  } catch (error) {
    console.error('Taksit seçenekleri alınamadı:', error);
    // Hata durumunda varsayılan olarak tek çekim seçeneğini döndür
    return [{
      value: 1,
      label: 'Tek Çekim',
      monthlyPayment: amount,
      totalPayment: amount
    }];
  }
}; 