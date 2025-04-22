import React, { useState, useEffect } from 'react';
import {
  Modal,
  Steps,
  Button,
  Form,
  Typography,
  Card,
  Radio,
  Input,
  message,
  Table,
} from "antd";
import {
  ShoppingOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import "../../styles/components/Order/OrderModal.css";

const { Text, Title } = Typography;

interface OrderModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isVisible,
  onCancel,
  onSuccess,
}) => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [currentStep, setCurrentStep] = useState(0);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  // KDV oranı %8 olarak hesaplanıyor
  const VAT_RATE = 0.08;
  const subtotal = total;
  const shipping = 0; // Ücretsiz kargo
  const vat = subtotal * VAT_RATE;
  const grandTotal = subtotal + vat + shipping;

  // Modal kapandığında formu sıfırla
  useEffect(() => {
    if (!isVisible) {
      form.resetFields();
      setCurrentStep(0);
      setOrderCompleted(false);
    }
  }, [isVisible, form]);

  const handleCancel = () => {
    onCancel();
    form.resetFields();
    setCurrentStep(0);
    setOrderCompleted(false);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values);
      // Burada sipariş işlemi gerçekleştirilecek
      setOrderCompleted(true);
      message.success("Siparişiniz başarıyla tamamlandı!");
      onSuccess();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleInvoiceModalClose = () => {
    setInvoiceModalVisible(false);
  };

  // Fatura verilerini hazırla
  const invoiceData = {
    orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleDateString("tr-TR"),
    customerInfo: {
      firstName: form.getFieldValue("firstName"),
      lastName: form.getFieldValue("lastName"),
      email: form.getFieldValue("email"),
      phone: form.getFieldValue("phone"),
      address: form.getFieldValue("address"),
      city: "İstanbul", // Varsayılan değer
      zipCode: "34000", // Varsayılan değer
    },
    items: items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: subtotal,
    shipping: shipping,
    vat: vat,
    grandTotal: grandTotal,
    paymentMethod: paymentMethod || "Kredi Kartı",
  };

  const columns = [
    {
      title: 'Ürün',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Adet',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right' as const,
    },
    {
      title: 'Birim Fiyat',
      dataIndex: 'price',
      key: 'price',
      align: 'right' as const,
      render: (price: number) => `₺${price.toFixed(2)}`,
    },
    {
      title: 'Toplam',
      key: 'total',
      align: 'right' as const,
      render: (_: unknown, record: { price: number; quantity: number }) => `₺${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  const renderStep1 = () => (
    <div className="order-modal-content">
      <div className="order-modal-section">
        <h3 className="order-modal-section-title">Sipariş Özeti</h3>
        <Table
          className="order-modal-table"
          columns={columns}
          dataSource={items}
          pagination={false}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3} className="order-modal-table-total">
                Toplam
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} className="order-modal-table-total">
                ₺{total.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </div>

      <div className="order-modal-section">
        <h3 className="order-modal-section-title">Ödeme Yöntemi</h3>
        <div className="order-modal-payment-methods">
          <div
            className={`order-modal-payment-method ${paymentMethod === 'credit_card' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('credit_card')}
          >
            <CreditCardOutlined className="order-modal-payment-method-icon" />
            <span>Kredi Kartı</span>
          </div>
          <div
            className={`order-modal-payment-method ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('bank_transfer')}
          >
            <FileTextOutlined className="order-modal-payment-method-icon" />
            <span>Havale/EFT</span>
          </div>
          <div
            className={`order-modal-payment-method ${paymentMethod === 'cash' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('cash')}
          >
            <ShoppingOutlined className="order-modal-payment-method-icon" />
            <span>Nakit</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="order-modal-content">
      <Form
        form={form}
        layout="vertical"
        className="order-modal-form"
      >
        <Form.Item
          name="firstName"
          label="Ad"
          rules={[{ required: true, message: "Lütfen adınızı girin" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Adınız" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Soyad"
          rules={[{ required: true, message: "Lütfen soyadınızı girin" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Soyadınız" />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-posta"
          rules={[
            { required: true, message: "Lütfen e-posta adresinizi girin" },
            { type: "email", message: "Geçerli bir e-posta adresi girin" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="E-posta adresiniz" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Telefon"
          rules={[{ required: true, message: "Lütfen telefon numaranızı girin" }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Telefon numaranız" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Adres"
          rules={[{ required: true, message: "Lütfen adresinizi girin" }]}
        >
          <Input.TextArea rows={3} placeholder="Adresiniz" />
        </Form.Item>

        {paymentMethod === 'credit_card' && (
          <>
            <Form.Item
              name="cardNumber"
              label="Kart Numarası"
              rules={[{ required: true, message: "Lütfen kart numarasını girin" }]}
            >
              <Input placeholder="1234 5678 9012 3456" />
            </Form.Item>

            <Form.Item
              name="expiryDate"
              label="Son Kullanma Tarihi"
              rules={[{ required: true, message: "Lütfen son kullanma tarihini girin" }]}
            >
              <Input placeholder="MM/YY" />
            </Form.Item>

            <Form.Item
              name="cvv"
              label="CVV"
              rules={[{ required: true, message: "Lütfen CVV kodunu girin" }]}
            >
              <Input placeholder="123" />
            </Form.Item>
          </>
        )}
      </Form>

      <div className="order-modal-actions">
        <Button
          className="order-modal-button order-modal-button-cancel"
          onClick={() => setCurrentStep(0)}
        >
          Geri
        </Button>
        <Button
          type="primary"
          className="order-modal-button order-modal-button-submit"
          onClick={handleSubmit}
        >
          Siparişi Tamamla
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="order-modal-success">
      <CheckCircleOutlined className="order-modal-success-icon" />
      <h3 className="order-modal-success-title">Siparişiniz Alındı!</h3>
      <Text className="order-modal-success-message">
        Siparişiniz başarıyla oluşturuldu. Sipariş detaylarını e-posta adresinize gönderdik.
      </Text>
      <Button
        type="primary"
        className="order-modal-button order-modal-button-submit"
        onClick={handleCancel}
      >
        Tamam
      </Button>
    </div>
  );

  const steps = [
    {
      title: "Sipariş Özeti",
      icon: <ShoppingOutlined />,
      content: renderStep1(),
    },
    {
      title: "Teslimat",
      icon: <EnvironmentOutlined />,
      content: (
        <div className="space-y-6">
          <Card
            className="border-0 shadow-sm"
            title={
              <Title level={4} className="mb-0">
                Kişisel Bilgiler
              </Title>
            }
          >
            <Form
              form={form}
              layout="vertical"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="firstName"
                  label={<Text strong>Ad</Text>}
                  rules={[{ required: true, message: "Lütfen adınızı girin" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Adınız"
                    className="rounded-md"
                  />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label={<Text strong>Soyad</Text>}
                  rules={[{ required: true, message: "Lütfen soyadınızı girin" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Soyadınız"
                    className="rounded-md"
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="email"
                label={<Text strong>E-posta</Text>}
                rules={[
                  { required: true, message: "Lütfen e-posta adresinizi girin" },
                  { type: "email", message: "Geçerli bir e-posta adresi girin" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="E-posta adresiniz"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label={<Text strong>Telefon Numarası</Text>}
                rules={[
                  { required: true, message: "Lütfen telefon numaranızı girin" },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="05XX XXX XX XX"
                  className="rounded-md"
                />
              </Form.Item>
            </Form>
          </Card>

          <Card
            className="border-0 shadow-sm"
            title={
              <Title level={4} className="mb-0">
                Teslimat Adresi
              </Title>
            }
          >
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                name="address"
                label={<Text strong>Teslimat Adresi</Text>}
                rules={[
                  { required: true, message: "Lütfen teslimat adresinizi girin" },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Adresinizi girin"
                  className="rounded-md"
                />
              </Form.Item>
            </Form>
          </Card>

          <Card
            className="border-0 shadow-sm"
            title={
              <Title level={4} className="mb-0">
                Kargo Yöntemi
              </Title>
            }
          >
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                name="shippingMethod"
                rules={[
                  { required: true, message: "Lütfen kargo yöntemini seçin" },
                ]}
              >
                <Radio.Group className="w-full">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:border-indigo-500 transition-all cursor-pointer">
                      <Radio value="standard" className="w-full">
                        <div className="flex justify-between items-center">
                          <div>
                            <Text strong>Standart Teslimat</Text>
                            <div className="text-gray-500 text-sm">
                              3-5 iş günü içinde teslimat
                            </div>
                          </div>
                          <Text strong className="text-green-500">
                            Ücretsiz
                          </Text>
                        </div>
                      </Radio>
                    </div>
                    <div className="border rounded-lg p-4 hover:border-indigo-500 transition-all cursor-pointer">
                      <Radio value="express" className="w-full">
                        <div className="flex justify-between items-center">
                          <div>
                            <Text strong>Express Teslimat</Text>
                            <div className="text-gray-500 text-sm">
                              1-2 iş günü içinde teslimat
                            </div>
                          </div>
                          <Text strong>₺24.99</Text>
                        </div>
                      </Radio>
                    </div>
                  </div>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Card>
        </div>
      ),
    },
    {
      title: "Ödeme",
      icon: <CreditCardOutlined />,
      content: renderStep2(),
    },
    {
      title: "Onay",
      icon: <CheckCircleOutlined />,
      content: renderStep3(),
    },
  ];

  return (
    <>
      <Modal
        title={
          <div className="order-modal-header">
            <h2 className="order-modal-title">Sipariş Oluştur</h2>
            <Button
              type="text"
              icon={<span className="order-modal-close">×</span>}
              onClick={handleCancel}
            />
          </div>
        }
        open={isVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
        className="order-modal"
      >
        <Steps
          current={currentStep}
          items={steps.map((item) => ({ title: item.title, icon: item.icon }))}
          className="mb-8"
          progressDot={false}
        />

        <div className="min-h-[400px]">{steps[currentStep].content}</div>

        <div className="flex justify-between mt-8">
          {currentStep > 0 && !orderCompleted && (
            <Button
              onClick={prevStep}
              className="h-10 px-8 bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Geri
            </Button>
          )}
          <div className="flex-1"></div>
          {currentStep < steps.length - 1 && !orderCompleted && (
            <Button
              type="primary"
              onClick={nextStep}
              className="bg-indigo-600 h-10 px-8"
            >
              İleri
            </Button>
          )}
          {orderCompleted && (
            <Button
              onClick={handleCancel}
              className="h-10 px-8 bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Kapat
            </Button>
          )}
        </div>
      </Modal>

      {/* Fatura Modalı */}
      <Modal
        title="Fatura"
        open={invoiceModalVisible}
        onCancel={handleInvoiceModalClose}
        footer={[
          <Button key="download" type="primary" onClick={() => {}}>
            <DownloadOutlined /> İndir
          </Button>,
          <Button key="close" onClick={handleInvoiceModalClose}>
            Kapat
          </Button>,
        ]}
        width={800}
      >
        {/* Fatura içeriği */}
        <div className="invoice-container">
          <div className="invoice-header">
            <div className="invoice-logo">
              <h1 className="text-2xl font-bold">LOGO</h1>
            </div>
            <div className="invoice-info">
              <h2 className="text-xl font-semibold">FATURA</h2>
              <p className="text-gray-600">Fatura No: {invoiceData.orderNumber}</p>
              <p className="text-gray-600">Tarih: {invoiceData.date}</p>
            </div>
          </div>

          <div className="invoice-customer">
            <h3 className="text-lg font-medium mb-2">Müşteri Bilgileri</h3>
            <p className="text-gray-700">
              {invoiceData.customerInfo.firstName} {invoiceData.customerInfo.lastName}
            </p>
            <p className="text-gray-700">{invoiceData.customerInfo.email}</p>
            <p className="text-gray-700">{invoiceData.customerInfo.phone}</p>
            <p className="text-gray-700">{invoiceData.customerInfo.address}</p>
          </div>

          <div className="mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Ürün</th>
                  <th className="border p-2 text-right">Adet</th>
                  <th className="border p-2 text-right">Birim Fiyat</th>
                  <th className="border p-2 text-right">Toplam</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{item.title}</td>
                    <td className="border p-2 text-right">{item.quantity}</td>
                    <td className="border p-2 text-right">
                      ₺{item.price.toFixed(2)}
                    </td>
                    <td className="border p-2 text-right">
                      ₺{item.quantity * item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="invoice-summary">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Ara Toplam:</span>
              <span className="font-medium">₺{invoiceData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">KDV (%8):</span>
              <span className="font-medium">₺{invoiceData.vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Kargo:</span>
              <span className="font-medium">₺{invoiceData.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Toplam:</span>
              <span>₺{invoiceData.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="invoice-footer mt-8">
            <p className="text-gray-500 text-sm">
              Ödeme Yöntemi: {invoiceData.paymentMethod}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Teşekkür ederiz!
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OrderModal;
