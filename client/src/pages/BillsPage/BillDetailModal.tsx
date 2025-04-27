import React from 'react';
import { Modal, Badge, Button, Typography, Row, Col, Divider } from 'antd';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import { Bill } from '../../services/billService';
import '../../styles/BillsPage/BillDetailModal.css';

const { Title, Text } = Typography;

interface BillDetailModalProps {
  bill: Bill;
  visible: boolean;
  onClose: () => void;
}

const BillDetailModal: React.FC<BillDetailModalProps> = ({ bill, visible, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // PDF indirme işlemi burada yapılacak
    console.log('Downloading bill:', bill._id);
  };

  return (
    <Modal
      title={
        <div className="bill-detail-header">
          <Title level={4}>Fatura Detayı</Title>
          <Text type="secondary">Fatura No: {bill.billNumber}</Text>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
          Yazdır
        </Button>,
        <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
          İndir
        </Button>,
        <Button key="close" onClick={onClose}>
          Kapat
        </Button>
      ]}
      width={800}
      className="bill-detail-modal"
    >
      <div className="bill-detail-content">
        <Row gutter={24}>
          <Col span={12}>
            <div className="bill-detail-section">
              <Title level={5}>Müşteri Bilgileri</Title>
              <Text>
                <strong>Ad Soyad:</strong> {bill.customer.name}
              </Text>
              <br />
              <Text>
                <strong>E-posta:</strong> {bill.customer.email || '-'}
              </Text>
              <br />
              <Text>
                <strong>Telefon:</strong> {bill.customer.phone || '-'}
              </Text>
              <br />
              <Text>
                <strong>Adres:</strong> {typeof bill.customer.address === 'object' 
                  ? `${bill.customer.address.street}, ${bill.customer.address.city}, ${bill.customer.address.state} ${bill.customer.address.zipCode}, ${bill.customer.address.country}`
                  : bill.customer.address || '-'}
              </Text>
            </div>
          </Col>
          <Col span={12}>
            <div className="bill-detail-section">
              <Title level={5}>Fatura Bilgileri</Title>
              <Text>
                <strong>Fatura No:</strong> {bill.billNumber}
              </Text>
              <br />
              <Text>
                <strong>Tarih:</strong> {new Date(bill.createdAt).toLocaleDateString('tr-TR')}
              </Text>
              <br />
              <Text>
                <strong>Durum:</strong> <Badge status="success" text={bill.status} />
              </Text>
              <br />
              <Text>
                <strong>Ödeme Yöntemi:</strong> {bill.paymentMethod || '-'}
              </Text>
            </div>
          </Col>
        </Row>

        <Divider />

        <div className="bill-detail-section">
          <Title level={5}>Ürünler</Title>
          <table className="bill-items-table">
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Miktar</th>
                <th>Birim Fiyat</th>
                <th>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₺{item.price.toFixed(2)}</td>
                  <td>₺{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Divider />

        <Row justify="end">
          <Col span={8}>
            <div className="bill-summary">
              <div className="bill-summary-row">
                <Text>Ara Toplam:</Text>
                <Text>₺{bill.subtotal?.toFixed(2) || '0.00'}</Text>
              </div>
              <div className="bill-summary-row">
                <Text>KDV:</Text>
                <Text>₺{bill.tax?.toFixed(2) || '0.00'}</Text>
              </div>
              <div className="bill-summary-row">
                <Text>Kargo:</Text>
                <Text>₺{bill.shippingCost?.toFixed(2) || '0.00'}</Text>
              </div>
              <Divider />
              <div className="bill-summary-row bill-total">
                <Text strong>Toplam:</Text>
                <Text strong>₺{bill.total.toFixed(2)}</Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default BillDetailModal; 