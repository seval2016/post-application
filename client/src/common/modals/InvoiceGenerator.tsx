import { jsPDF } from 'jspdf';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

interface InvoiceData {
  orderNumber: string;
  date: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
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

interface InvoiceGeneratorProps {
  invoiceData: InvoiceData;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ invoiceData }) => {
  const generateInvoice = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Başlık
    doc.setFontSize(20);
    doc.text('FATURA', pageWidth / 2, 20, { align: 'center' });
    
    // Fatura Bilgileri
    doc.setFontSize(12);
    doc.text(`Fatura No: ${invoiceData.orderNumber}`, 20, 40);
    doc.text(`Tarih: ${new Date(invoiceData.date).toLocaleDateString('tr-TR')}`, 20, 50);
    
    // Müşteri Bilgileri
    doc.setFontSize(14);
    doc.text('Müşteri Bilgileri', 20, 70);
    doc.setFontSize(12);
    doc.text(`Ad Soyad: ${invoiceData.customerInfo.firstName} ${invoiceData.customerInfo.lastName}`, 20, 80);
    doc.text(`E-posta: ${invoiceData.customerInfo.email}`, 20, 90);
    doc.text(`Telefon: ${invoiceData.customerInfo.phone}`, 20, 100);
    doc.text(`Adres: ${invoiceData.customerInfo.address}`, 20, 110);
    doc.text(`${invoiceData.customerInfo.city} / ${invoiceData.customerInfo.zipCode}`, 20, 120);
    
    // Ürün Tablosu
    doc.setFontSize(14);
    doc.text('Ürünler', 20, 140);
    
    // Tablo Başlıkları
    doc.setFontSize(12);
    doc.text('Ürün', 20, 150);
    doc.text('Adet', 100, 150);
    doc.text('Fiyat', 130, 150);
    doc.text('Toplam', 160, 150);
    
    // Ürünler
    let yPos = 160;
    invoiceData.items.forEach((item) => {
      doc.text(item.title, 20, yPos);
      doc.text(item.quantity.toString(), 100, yPos);
      doc.text(`₺${item.price.toFixed(2)}`, 130, yPos);
      doc.text(`₺${(item.quantity * item.price).toFixed(2)}`, 160, yPos);
      yPos += 10;
    });
    
    // Toplam Bilgileri
    yPos += 10;
    doc.text(`Ara Toplam: ₺${invoiceData.subtotal.toFixed(2)}`, 130, yPos);
    yPos += 10;
    doc.text(`Kargo: ${invoiceData.shipping === 0 ? 'Ücretsiz' : `₺${invoiceData.shipping.toFixed(2)}`}`, 130, yPos);
    yPos += 10;
    doc.text(`KDV (%8): ₺${invoiceData.vat.toFixed(2)}`, 130, yPos);
    yPos += 10;
    doc.setFontSize(14);
    doc.text(`Genel Toplam: ₺${invoiceData.grandTotal.toFixed(2)}`, 130, yPos);
    
    // Ödeme Yöntemi
    yPos += 20;
    doc.setFontSize(12);
    doc.text(`Ödeme Yöntemi: ${invoiceData.paymentMethod}`, 20, yPos);
    
    // PDF'i İndir
    doc.save(`fatura-${invoiceData.orderNumber}.pdf`);
  };

  return (
    <Button 
      type="primary" 
      icon={<DownloadOutlined />} 
      onClick={generateInvoice}
      className="mt-4"
    >
      Faturayı İndir
    </Button>
  );
};

export default InvoiceGenerator; 