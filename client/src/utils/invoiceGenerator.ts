import jsPDF from 'jspdf';

export interface InvoiceData {
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  vat: number;
  total: number;
  paymentMethod: string;
}

export const generateAndDownloadInvoice = (data: InvoiceData) => {
  const doc = new jsPDF();

  // Company Info
  doc.setFontSize(20);
  doc.text('FATURA', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('POS Uygulaması', 20, 30);

  // Customer Info
  doc.text(`Müşteri Adı: ${data.customerName}`, 20, 50);
  doc.text(`E-posta: ${data.customerEmail}`, 20, 60);
  doc.text(`Telefon: ${data.customerPhone}`, 20, 70);
  doc.text(`Adres: ${data.customerAddress}`, 20, 80);

  // Order Info
  doc.text(`Sipariş No: ${data.orderNumber}`, 20, 100);
  doc.text(`Tarih: ${data.date}`, 20, 110);
  doc.text(`Ödeme Yöntemi: ${data.paymentMethod}`, 20, 120);

  // Items Table
  let yPos = 140;
  doc.text('Ürün', 20, yPos);
  doc.text('Miktar', 100, yPos);
  doc.text('Fiyat', 140, yPos);
  doc.text('Toplam', 180, yPos);
  yPos += 10;

  data.items.forEach(item => {
    doc.text(item.name, 20, yPos);
    doc.text(item.quantity.toString(), 100, yPos);
    doc.text(`₺${item.price.toFixed(2)}`, 140, yPos);
    doc.text(`₺${(item.quantity * item.price).toFixed(2)}`, 180, yPos);
    yPos += 10;
  });

  // Totals
  yPos += 10;
  doc.text(`Ara Toplam: ₺${data.subtotal.toFixed(2)}`, 140, yPos);
  yPos += 10;
  doc.text(`KDV (%18): ₺${data.vat.toFixed(2)}`, 140, yPos);
  yPos += 10;
  doc.text(`Genel Toplam: ₺${data.total.toFixed(2)}`, 140, yPos);

  // Save PDF
  doc.save(`fatura-${data.orderNumber}.pdf`);
}; 