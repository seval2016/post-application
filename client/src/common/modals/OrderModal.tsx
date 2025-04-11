import { useState } from "react";
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
  Badge,
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
import jsPDF from "jspdf";

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

  // KDV oranı %8 olarak hesaplanıyor
  const VAT_RATE = 0.08;
  const subtotal = total;
  const shipping = 0; // Ücretsiz kargo
  const vat = subtotal * VAT_RATE;
  const grandTotal = subtotal + vat + shipping;

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

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values);
        // Burada sipariş işlemi gerçekleştirilecek
        setOrderCompleted(true);
        message.success("Siparişiniz başarıyla tamamlandı!");
        onSuccess();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const generateInvoice = () => {
    // Fatura modalını aç
    setInvoiceModalVisible(true);
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
    paymentMethod: form.getFieldValue("paymentMethod") || "Kredi Kartı",
  };

  const steps = [
    {
      title: "Sipariş Özeti",
      icon: <ShoppingOutlined />,
      content: (
        <div className="space-y-6">
          <Card
            className="border-0 shadow-sm"
            title={
              <Title level={4} className="mb-0">
                Sipariş Detayları
              </Title>
            }
            extra={
              <Badge
                count={items.length}
                style={{ backgroundColor: "#52c41a" }}
              />
            }
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600">Ürün Sayısı</Text>
                <Text strong>{items.length} adet</Text>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600">Ara Toplam</Text>
                <Text strong>₺{subtotal.toFixed(2)}</Text>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600">Kargo</Text>
                <Text strong>
                  {shipping === 0 ? "Ücretsiz" : `₺${shipping}`}
                </Text>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <Text className="text-gray-600">KDV (%8)</Text>
                <Text strong>₺{vat.toFixed(2)}</Text>
              </div>
              <div className="flex justify-between items-center py-2">
                <Text strong className="text-lg">
                  Toplam
                </Text>
                <Text strong className="text-lg text-indigo-600">
                  ₺{grandTotal.toFixed(2)}
                </Text>
              </div>
            </div>
          </Card>

          <Card
            className="border-0 shadow-sm"
            title={
              <Title level={4} className="mb-0">
                Promosyon Kodu
              </Title>
            }
          >
            <div className="flex gap-2">
              <Input placeholder="Kodunuzu girin" className="h-10" />
              <Button type="primary" className="bg-blue-500 h-10">
                UYGULA
              </Button>
            </div>
          </Card>
        </div>
      ),
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
          </Card>

          <Card
            className="border-0 shadow-sm"
            title={
              <Title level={4} className="mb-0">
                Teslimat Adresi
              </Title>
            }
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
          </Card>

          <Card
            className="border-0 shadow-sm"
            title={
              <Title level={4} className="mb-0">
                Kargo Yöntemi
              </Title>
            }
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
          </Card>
        </div>
      ),
    },
    {
      title: "Ödeme",
      icon: <CreditCardOutlined />,
      content: (
        <div className="space-y-6">
          <Card
            className="border-0 shadow-sm"
            title={
              <Title level={4} className="mb-0">
                Ödeme Yöntemi
              </Title>
            }
          >
            <Form.Item
              name="paymentMethod"
              rules={[
                { required: true, message: "Lütfen ödeme yöntemini seçin" },
              ]}
            >
              <Radio.Group className="w-full">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:border-indigo-500 transition-all cursor-pointer">
                    <Radio value="creditCard" className="w-full">
                      <div className="flex items-center">
                        <CreditCardOutlined className="text-xl mr-2" />
                        <Text strong>Kredi Kartı</Text>
                      </div>
                    </Radio>
                  </div>
                  <div className="border rounded-lg p-4 hover:border-indigo-500 transition-all cursor-pointer">
                    <Radio value="bankTransfer" className="w-full">
                      <div className="flex items-center">
                        <FileTextOutlined className="text-xl mr-2" />
                        <Text strong>Banka Havalesi</Text>
                      </div>
                    </Radio>
                  </div>
                  <div className="border rounded-lg p-4 hover:border-indigo-500 transition-all cursor-pointer">
                    <Radio value="cashOnDelivery" className="w-full">
                      <div className="flex items-center">
                        <ShoppingOutlined className="text-xl mr-2" />
                        <Text strong>Kapıda Ödeme</Text>
                      </div>
                    </Radio>
                  </div>
                </div>
              </Radio.Group>
            </Form.Item>
          </Card>

          <Card
            className="border-0 shadow-sm"
            title={
              <Title level={4} className="mb-0">
                Kart Bilgileri
              </Title>
            }
          >
            <Form layout="vertical">
              <Form.Item
                name="cardNumber"
                label={<Text strong>Kart Numarası</Text>}
                rules={[
                  { required: true, message: "Lütfen kart numaranızı girin" },
                ]}
              >
                <Input
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  className="rounded-md"
                />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="expiryDate"
                  label={<Text strong>Son Kullanma Tarihi</Text>}
                  rules={[
                    {
                      required: true,
                      message: "Lütfen son kullanma tarihini girin",
                    },
                  ]}
                >
                  <Input
                    placeholder="AA/YY"
                    maxLength={5}
                    className="rounded-md"
                  />
                </Form.Item>

                <Form.Item
                  name="cvv"
                  label={<Text strong>CVV</Text>}
                  rules={[
                    { required: true, message: "Lütfen CVV kodunu girin" },
                  ]}
                >
                  <Input
                    placeholder="123"
                    maxLength={3}
                    className="rounded-md"
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="cardName"
                label={<Text strong>Kart Üzerindeki İsim</Text>}
                rules={[
                  {
                    required: true,
                    message: "Lütfen kart sahibinin adını girin",
                  },
                ]}
              >
                <Input placeholder="Ad Soyad" className="rounded-md" />
              </Form.Item>
            </Form>
          </Card>
        </div>
      ),
    },
    {
      title: "Onay",
      icon: <CheckCircleOutlined />,
      content: (
        <div className="text-center py-8">
          {orderCompleted ? (
            <div className="space-y-6">
              <div className="bg-green-50 p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center">
                <CheckCircleOutlined
                  style={{ fontSize: "64px", color: "#52c41a" }}
                />
              </div>
              <Title level={3} className="mb-2">
                Siparişiniz Başarıyla Tamamlandı!
              </Title>
              <Text className="text-gray-600 block mb-6">
                Siparişiniz başarıyla alındı. Siparişiniz en kısa sürede
                hazırlanacak ve kargoya verilecektir.
              </Text>
              <div className="pt-4">
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  size="large"
                  onClick={generateInvoice}
                  className="bg-green-500 h-12 px-8 rounded-full"
                >
                  Fatura Oluştur
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-indigo-50 p-8 rounded-full w-32 h-32 mx-auto flex items-center justify-center">
                <CheckCircleOutlined
                  style={{ fontSize: "64px", color: "#4f46e5" }}
                />
              </div>
              <Title level={3} className="mb-2">
                Siparişinizi Onaylıyor musunuz?
              </Title>
              <Text className="text-gray-600 block mb-6">
                Lütfen tüm bilgilerin doğru olduğundan emin olun. Siparişinizi
                onayladıktan sonra ödeme işlemi gerçekleştirilecektir.
              </Text>
              <div className="pt-4">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmit}
                  className="bg-indigo-600 h-12 px-8 rounded-full"
                >
                  Siparişi Onayla
                </Button>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <Title level={4} className="mb-0">
            Sipariş Adımları
          </Title>
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
          {currentStep === steps.length - 1 && !orderCompleted && (
            <Button
              type="primary"
              onClick={handleSubmit}
              className="bg-indigo-600 h-10 px-8"
            >
              Siparişi Tamamla
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
        title={
          <Title level={4} className="mb-0">
            Fatura Önizleme
          </Title>
        }
        open={invoiceModalVisible}
        onCancel={handleInvoiceModalClose}
        footer={[
          <Button key="close" onClick={handleInvoiceModalClose}>
            Kapat
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              // Fatura indirme işlemi
              const doc = new jsPDF();
              const pageWidth = doc.internal.pageSize.getWidth();

              // Başlık
              doc.setFontSize(20);
              doc.text("FATURA", pageWidth / 2, 20, { align: "center" });

              // Fatura Bilgileri
              doc.setFontSize(12);
              doc.text(`Fatura No: ${invoiceData.orderNumber}`, 20, 40);
              doc.text(`Tarih: ${invoiceData.date}`, 20, 50);

              // Müşteri Bilgileri
              doc.setFontSize(14);
              doc.text("Müşteri Bilgileri", 20, 70);
              doc.setFontSize(12);
              doc.text(
                `Ad Soyad: ${invoiceData.customerInfo.firstName} ${invoiceData.customerInfo.lastName}`,
                20,
                80
              );
              doc.text(`E-posta: ${invoiceData.customerInfo.email}`, 20, 90);
              doc.text(`Telefon: ${invoiceData.customerInfo.phone}`, 20, 100);
              doc.text(`Adres: ${invoiceData.customerInfo.address}`, 20, 110);
              doc.text(
                `${invoiceData.customerInfo.city} / ${invoiceData.customerInfo.zipCode}`,
                20,
                120
              );

              // Ürün Tablosu
              doc.setFontSize(14);
              doc.text("Ürünler", 20, 140);

              // Tablo Başlıkları
              doc.setFontSize(12);
              doc.text("Ürün", 20, 150);
              doc.text("Adet", 100, 150);
              doc.text("Fiyat", 130, 150);
              doc.text("Toplam", 160, 150);

              // Ürünler
              let yPos = 160;
              invoiceData.items.forEach((item) => {
                doc.text(item.title, 20, yPos);
                doc.text(item.quantity.toString(), 100, yPos);
                doc.text(`₺${item.price.toFixed(2)}`, 130, yPos);
                doc.text(
                  `₺${(item.quantity * item.price).toFixed(2)}`,
                  160,
                  yPos
                );
                yPos += 10;
              });

              // Toplam Bilgileri
              yPos += 10;
              doc.text(
                `Ara Toplam: ₺${invoiceData.subtotal.toFixed(2)}`,
                130,
                yPos
              );
              yPos += 10;
              doc.text(
                `Kargo: ${
                  invoiceData.shipping === 0
                    ? "Ücretsiz"
                    : `₺${invoiceData.shipping.toFixed(2)}`
                }`,
                130,
                yPos
              );
              yPos += 10;
              doc.text(`KDV (%8): ₺${invoiceData.vat.toFixed(2)}`, 130, yPos);
              yPos += 10;
              doc.setFontSize(14);
              doc.text(
                `Genel Toplam: ₺${invoiceData.grandTotal.toFixed(2)}`,
                130,
                yPos
              );

              // Ödeme Yöntemi
              yPos += 20;
              doc.setFontSize(12);
              doc.text(`Ödeme Yöntemi: ${invoiceData.paymentMethod}`, 20, yPos);

              // PDF'i İndir
              doc.save(`fatura-${invoiceData.orderNumber}.pdf`);

              message.success("Faturanız indirildi!");
              handleInvoiceModalClose();
            }}
          >
            İndir
          </Button>,
        ]}
        width={800}
      >
        <div className="p-6 bg-white">
          <div className="flex justify-between mb-6">
            <div>
              <Title level={3}>FATURA</Title>
              <Text className="block text-gray-500">
                Sipariş No: {invoiceData.orderNumber}
              </Text>
              <Text className="block text-gray-500">
                Tarih: {invoiceData.date}
              </Text>
            </div>
            <div className="text-right">
              <Title level={4}>Şirket Adı</Title>
              <Text className="block">Adres Bilgileri</Text>
              <Text className="block">Vergi No: 1234567890</Text>
            </div>
          </div>

          <div className="mb-6">
            <Title level={4}>Müşteri Bilgileri</Title>
            <Text className="block">{invoiceData.customerInfo.firstName} {invoiceData.customerInfo.lastName}</Text>
            <Text className="block">{invoiceData.customerInfo.email}</Text>
            <Text className="block">{invoiceData.customerInfo.phone}</Text>
            <Text className="block">{invoiceData.customerInfo.address}</Text>
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

          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2 border-b">
                <Text strong>Ara Toplam:</Text>
                <Text>₺{invoiceData.subtotal.toFixed(2)}</Text>
              </div>
              <div className="flex justify-between py-2 border-b">
                <Text strong>Kargo:</Text>
                <Text>
                  {invoiceData.shipping === 0
                    ? "Ücretsiz"
                    : `₺${invoiceData.shipping.toFixed(2)}`}
                </Text>
              </div>
              <div className="flex justify-between py-2 border-b">
                <Text strong>KDV (%8):</Text>
                <Text>₺{invoiceData.vat.toFixed(2)}</Text>
              </div>
              <div className="flex justify-between py-2">
                <Text strong className="text-lg">
                  Toplam:
                </Text>
                <Text strong className="text-lg text-indigo-600">
                  ₺{invoiceData.grandTotal.toFixed(2)}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OrderModal;
