export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface InvoiceData {
  orderNumber: string;
  date: string;
  customerInfo: CustomerInfo;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  vat: number;
  grandTotal: number;
  paymentMethod: string;
} 