import React from 'react';
import { Modal, Button, Row, Col, Typography, Divider } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface InvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  invoiceData: {
    invoiceNumber: string;
    createdAt: string;
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
    };
    items: Array<{
      title: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    vat: number;
    shipping: number;
    grandTotal: number;
  };
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  visible,
  onClose,
  invoiceData
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      title="Fatura Detayları"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
          Yazdır
        </Button>,
        <Button key="close" onClick={onClose}>
          Kapat
        </Button>
      ]}
    >
      <div className="invoice-content">
        <Row justify="space-between" align="top">
          <Col>
            <Title level={4}>FATURA</Title>
            <Text>Fatura No: {invoiceData.invoiceNumber}</Text>
            <br />
            <Text>Tarih: {new Date(invoiceData.createdAt).toLocaleDateString('tr-TR')}</Text>
          </Col>
          <Col>
            <img src="/logo.png" alt="Logo" style={{ height: 50 }} />
          </Col>
        </Row>

        <Divider />

        <Row gutter={24}>
          <Col span={12}>
            <Title level={5}>Müşteri Bilgileri</Title>
            <Text>
              {invoiceData.customer.firstName} {invoiceData.customer.lastName}
              <br />
              {invoiceData.customer.email}
              <br />
              {invoiceData.customer.phone}
              <br />
              {invoiceData.customer.address}
            </Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Şirket Bilgileri</Title>
            <Text>
              POS Uygulaması A.Ş.
              <br />
              info@posapp.com
              <br />
              +90 212 123 45 67
              <br />
              İstanbul, Türkiye
            </Text>
          </Col>
        </Row>

        <Divider />

        <div className="invoice-items">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Miktar</th>
                <th>Birim Fiyat</th>
                <th>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(2)} ₺</td>
                  <td>{(item.quantity * item.price).toFixed(2)} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Divider />

        <Row justify="end">
          <Col span={8}>
            <Row justify="space-between">
              <Col>Ara Toplam:</Col>
              <Col>{invoiceData.subtotal.toFixed(2)} ₺</Col>
            </Row>
            <Row justify="space-between">
              <Col>KDV ({(invoiceData.vat / invoiceData.subtotal * 100).toFixed(0)}%):</Col>
              <Col>{invoiceData.vat.toFixed(2)} ₺</Col>
            </Row>
            <Row justify="space-between">
              <Col>Kargo:</Col>
              <Col>{invoiceData.shipping.toFixed(2)} ₺</Col>
            </Row>
            <Divider />
            <Row justify="space-between">
              <Col><strong>Genel Toplam:</strong></Col>
              <Col><strong>{invoiceData.grandTotal.toFixed(2)} ₺</strong></Col>
            </Row>
          </Col>
        </Row>
      </div>

      <style>
        {`
          .invoice-content {
            padding: 20px;
          }
          .invoice-items table {
            margin: 20px 0;
          }
          .invoice-items th,
          .invoice-items td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
          }
          @media print {
            .ant-modal-footer,
            .ant-modal-close {
              display: none;
            }
          }
        `}
      </style>
    </Modal>
  );
};

export default InvoiceModal; 