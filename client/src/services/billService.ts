import api from '../utils/api';
import { API_URL } from '../config';

// Fatura veri tipi
export interface Bill {
  _id: string;
  billNumber: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash';
  paymentDetails?: {
    transactionId: string;
    paymentDate: Date;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

class BillService {
  private baseUrl = `${API_URL}/bills`;

  async getAllBills(): Promise<Bill[]> {
    const response = await api.get(this.baseUrl);
    return response.data.data;
  }

  async getBillById(id: string): Promise<Bill> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async getBillByOrderId(orderId: string): Promise<Bill> {
    const response = await api.get(`${this.baseUrl}/order/${orderId}`);
    return response.data.data;
  }

  async createBill(billData: Partial<Bill>): Promise<Bill> {
    const response = await api.post(this.baseUrl, billData);
    return response.data.data;
  }

  async updateBill(id: string, billData: Partial<Bill>): Promise<Bill> {
    const response = await api.put(`${this.baseUrl}/${id}`, billData);
    return response.data.data;
  }

  async updateBillStatus(id: string, status: Bill['status']): Promise<Bill> {
    const response = await api.put(`${this.baseUrl}/${id}/status`, { status });
    return response.data.data;
  }

  async deleteBill(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  // Yardımcı metodlar
  calculateSubtotal(items: Bill['items']): number {
    return items.reduce((total, item) => total + item.total, 0);
  }

  calculateTax(subtotal: number, taxRate: number = 0.18): number {
    return subtotal * taxRate;
  }

  calculateTotal(subtotal: number, tax: number, shippingCost: number): number {
    return subtotal + tax + shippingCost;
  }

  formatBillNumber(date: Date = new Date()): string {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BILL-${year}${month}-${random}`;
  }

  // Fatura durumu için yardımcı metodlar
  getStatusColor(status: Bill['status']): string {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  }

  getStatusText(status: Bill['status']): string {
    switch (status) {
      case 'paid':
        return 'Ödendi';
      case 'pending':
        return 'Beklemede';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  }
}

export default new BillService(); 