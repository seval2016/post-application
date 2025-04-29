import React, { useState } from 'react';
import { Modal, Steps, Form, Radio, Button, Result, message } from 'antd';
import OrderSummary from './OrderSummary';
import DeliveryInfo from './DeliveryInfo';
import CreditCardForm from './CreditCardForm';
import CustomerInfo from './CustomerInfo';
import { PaymentMethodType } from '../../../types';
import { DownloadOutlined } from '@ant-design/icons';
import { generateAndDownloadInvoice, InvoiceData } from '../../../utils/invoiceGenerator';

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
      // Form validasyonunu kontrol et
      const values = await form.validateFields();
      console.log('Form values:', values);
      
      // Rastgele sipariş numarası oluştur
      const newOrderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      console.log('Order completed, number:', newOrderNumber);
      
      // State'leri güncelle
      setOrderNumber(newOrderNumber);
      setOrderCompleted(true);
      
      // Başarı callback'ini çağırma - yönlendirme olmayacak
      // if (onSuccess) {
      //   onSuccess();
      // }
    } catch (error) {
      console.error('Validation failed:', error);
      // Hata mesajını göster
      message.error('Lütfen tüm zorunlu alanları doldurunuz');
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
      content: <CustomerInfo form={form} />,
    },
    {
      title: 'Teslimat Bilgileri',
      content: <DeliveryInfo form={form} />,
    },
    {
      title: 'Ödeme',
      content: (
        <Form form={form} layout="vertical">
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
          {paymentMethod === 'credit_card' && <CreditCardForm form={form} onFinish={handleFinish} />}
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
        </Form>
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
        <>
          <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />
          <div>{steps[currentStep].content}</div>
        </>
      )}
    </Modal>
  );
};

export default OrderModal;