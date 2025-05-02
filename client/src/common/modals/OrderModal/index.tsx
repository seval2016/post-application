import React, { useState } from 'react';
import { Modal, Steps, Form, Radio, Button, Result, message, Input } from 'antd';
import OrderSummary from './OrderSummary';
import DeliveryInfo from './DeliveryInfo';
import CustomerInfo from './CustomerInfo';
import { PaymentMethodType } from '../../../types';
import { DownloadOutlined } from '@ant-design/icons';
import { generateAndDownloadInvoice, InvoiceData } from '../../../utils/invoiceGenerator';
import { createOrder } from '../../../services/orderService';

interface FormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  companyName?: string;
  taxNumber?: string;
  taxOffice?: string;
  paymentMethod: PaymentMethodType;
  notes?: string;
}

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  values: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      total: number;
    }>;
    subtotal: number;
    vat: number;
    total: number;
  };
}

const OrderModal: React.FC<OrderModalProps> = ({
  open,
  onClose,
  values,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm<FormValues>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit_card');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const cartItems = values.items;
  const subTotal = values.subtotal;
  const vat = values.vat;
  const total = values.total;

  const handleFinish = async () => {
    try {
      // Tüm form değerlerini al
      const values = await form.validateFields();
      console.log('Form değerleri:', values);

      // Form değerlerinin varlığını kontrol et
      if (!values.fullName || !values.email || !values.phone || 
          !values.address || !values.city || !values.district || !values.postalCode) {
        message.error('Lütfen tüm gerekli alanları doldurun');
        return;
      }

      // Ad ve soyadı ayır
      const nameParts = values.fullName.trim().split(' ');
      if (nameParts.length < 2) {
        message.error('Lütfen hem adınızı hem soyadınızı giriniz');
        return;
      }
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      // Telefon numarasını formatla
      const phone = values.phone.replace(/\D/g, '');
      if (phone.length !== 10) {
        message.error('Telefon numarası 10 haneli olmalıdır');
        return;
      }

      const orderData = {
        customer: {
          firstName,
          lastName,
          email: values.email,
          phone: phone,
          address: values.address,
          city: values.city,
          district: values.district,
          postalCode: values.postalCode,
          country: 'Turkey',
          companyName: values.companyName,
          taxNumber: values.taxNumber,
          taxOffice: values.taxOffice
        },
        items: cartItems.map(item => ({
          productId: item.id.toString(),
          title: item.name,
          quantity: Number(item.quantity),
          price: Number(item.price)
        })),
        subtotal: Number(subTotal),
        vat: Number(vat),
        shipping: 0,
        grandTotal: Number(total),
        paymentMethod: paymentMethod,
        shippingMethod: 'standard',
        status: 'pending',
        notes: values.notes
      };

      console.log('Gönderilen sipariş verisi:', orderData);

      const response = await createOrder(orderData);
      
      if (response && response.success) {
        setOrderNumber(response.orderNumber);
        setOrderCompleted(true);
        message.success('Siparişiniz başarıyla oluşturuldu!');
        form.resetFields();
        onClose();
        window.location.href = `/order-success?orderNumber=${response.orderNumber}`;
      } else {
        throw new Error(response?.message || 'Sipariş oluşturulurken bir hata oluştu');
      }
    } catch (error) {
      console.error('Sipariş oluşturma hatası:', error);
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Sipariş oluşturulurken bir hata oluştu');
      }
    }
  };

  const handleDownloadInvoice = () => {
    if (!orderNumber) {
      message.error('Sipariş numarası bulunamadı!');
      return;
    }

    const formValues = form.getFieldsValue();
    const invoiceData: InvoiceData = {
      orderNumber,
      date: new Date().toLocaleDateString('tr-TR'),
      customerName: formValues.fullName,
      customerEmail: formValues.email,
      customerPhone: formValues.phone,
      customerAddress: formValues.address,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal: subTotal,
      vat: vat,
      total: total,
      paymentMethod: paymentMethod === 'credit_card' ? 'Kredi Kartı' : 'Nakit'
    };

    generateAndDownloadInvoice(invoiceData);
  };

  const steps = [
    {
      title: 'Sipariş Özeti',
      content: <OrderSummary values={values} />,
    },
    {
      title: 'Müşteri Bilgileri',
      content: <CustomerInfo />,
    },
    {
      title: 'Teslimat Bilgileri',
      content: <DeliveryInfo form={form} />,
    },
    {
      title: 'Ödeme',
      content: (
        <>
          <Form.Item
            name="paymentMethod"
            label="Ödeme Yöntemi"
            rules={[{ required: true, message: 'Lütfen ödeme yöntemi seçiniz' }]}
          >
            <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
              <Radio.Button value="credit_card">Kredi Kartı</Radio.Button>
              <Radio.Button value="cash_on_delivery">Kapıda Ödeme</Radio.Button>
              <Radio.Button value="bank_transfer">Havale/EFT</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {paymentMethod === 'credit_card' && (
            <div className="credit-card-form" style={{ marginTop: 16 }}>
              <Form.Item
                name="cardNumber"
                label="Kart Numarası"
                rules={[
                  { required: true, message: 'Lütfen kart numaranızı giriniz' },
                  { pattern: /^[0-9]{16}$/, message: 'Kart numarası 16 haneli olmalıdır' }
                ]}
              >
                <Input 
                  placeholder="1234 5678 9012 3456" 
                  maxLength={16}
                  style={{ 
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d9d9d9',
                    transition: 'all 0.3s'
                  }}
                />
              </Form.Item>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                  name="expiryDate"
                  label="Son Kullanma Tarihi"
                  rules={[
                    { required: true, message: 'Lütfen son kullanma tarihini giriniz' },
                    { pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, message: 'MM/YY formatında giriniz' }
                  ]}
                >
                  <Input 
                    placeholder="MM/YY" 
                    maxLength={5}
                    style={{ 
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d9d9d9',
                      transition: 'all 0.3s'
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="cvv"
                  label="CVV"
                  rules={[
                    { required: true, message: 'Lütfen CVV kodunu giriniz' },
                    { pattern: /^[0-9]{3,4}$/, message: 'CVV 3 veya 4 haneli olmalıdır' }
                  ]}
                >
                  <Input 
                    placeholder="123" 
                    maxLength={4}
                    style={{ 
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d9d9d9',
                      transition: 'all 0.3s'
                    }}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="cardHolder"
                label="Kart Sahibinin Adı"
                rules={[{ required: true, message: 'Lütfen kart sahibinin adını giriniz' }]}
              >
                <Input 
                  placeholder="Ad Soyad"
                  style={{ 
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d9d9d9',
                    transition: 'all 0.3s'
                  }}
                />
              </Form.Item>
            </div>
          )}
          {paymentMethod === 'bank_transfer' && (
            <div style={{ marginTop: 16 }}>
              <h4>Banka Hesap Bilgileri</h4>
              <p>Banka: X Bankası</p>
              <p>IBAN: TR00 0000 0000 0000 0000 0000 00</p>
              <p>Hesap Sahibi: Şirket Adı</p>
              <p>Açıklama: Sipariş numaranızı açıklama kısmına yazmayı unutmayınız.</p>
            </div>
          )}
          {paymentMethod === 'cash_on_delivery' && (
            <div style={{ marginTop: 16 }}>
              <p>Kapıda ödeme seçeneğini seçtiniz. Siparişiniz teslim edildiğinde ödeme yapabilirsiniz.</p>
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <Modal
      title="Sipariş Onayı"
      open={open}
      onCancel={onClose}
      width={800}
      footer={orderCompleted ? null : [
        <Button key="back" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0}>
          Geri
        </Button>,
        currentStep === steps.length - 1 ? (
          <Button key="submit" type="primary" onClick={handleFinish}>
            Siparişi Tamamla
          </Button>
        ) : (
          <Button key="next" type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
            İleri
          </Button>
        ),
      ]}
    >
      {orderCompleted ? (
        <Result
          status="success"
          title="Siparişiniz Başarıyla Tamamlandı!"
          subTitle={`Sipariş Numaranız: ${orderNumber}`}
          extra={[
            <Button type="primary" key="download" onClick={handleDownloadInvoice} icon={<DownloadOutlined />}>
              Fatura İndir
            </Button>,
            <Button key="close" onClick={onClose}>
              Kapat
            </Button>,
          ]}
        />
      ) : (
        <Form form={form} layout="vertical">
          <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />
          <div>{steps[currentStep].content}</div>
        </Form>
      )}
    </Modal>
  );
};

export default OrderModal;