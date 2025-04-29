export type PaymentMethodType = 'credit_card' | 'bank_transfer' | 'cash';

export interface Customer {
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
}

export interface BillItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Bill {
  orderId: string;
  customer: Customer;
  items: BillItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentDetails?: {
    transactionId: string;
    paymentDate: Date;
  };
  notes?: string;
} 