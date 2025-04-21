import React from 'react';
import { Form, Input, Select, Button, Card, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import '../../../styles/components/Customer/CustomerForm.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
}

interface CustomerFormProps {
  onSubmit: (values: Customer) => void;
  onCancel: () => void;
  initialValues?: Partial<Customer>;
  loading?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: Customer) => {
    try {
      await onSubmit(values);
      message.success('Müşteri başarıyla kaydedildi');
      form.resetFields();
    } catch {
      message.error('Müşteri kaydedilirken bir hata oluştu');
    }
  };

  return (
    <Card className="customer-form-card">
      <div className="customer-form-header">
        <Title level={4} className="customer-form-title">
          Müşteri Bilgileri
        </Title>
        <Text className="customer-form-subtitle">
          Lütfen müşteri bilgilerini eksiksiz doldurun
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        className="customer-form"
      >
        <Form.Item
          name="name"
          label="Ad Soyad"
          rules={[{ required: true, message: 'Lütfen ad soyad giriniz' }]}
        >
          <Input
            prefix={<UserOutlined className="customer-form-input-prefix" />}
            placeholder="Ad Soyad"
            className="customer-form-input"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-posta"
          rules={[
            { required: true, message: 'Lütfen e-posta giriniz' },
            { type: 'email', message: 'Geçerli bir e-posta adresi giriniz' },
          ]}
        >
          <Input
            prefix={<MailOutlined className="customer-form-input-prefix" />}
            placeholder="E-posta"
            className="customer-form-input"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Telefon"
          rules={[{ required: true, message: 'Lütfen telefon giriniz' }]}
        >
          <Input
            prefix={<PhoneOutlined className="customer-form-input-prefix" />}
            placeholder="Telefon"
            className="customer-form-input"
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="Adres"
          rules={[{ required: true, message: 'Lütfen adres giriniz' }]}
        >
          <TextArea
            placeholder="Adres"
            rows={4}
            className="customer-form-textarea"
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Durum"
          rules={[{ required: true, message: 'Lütfen durum seçiniz' }]}
        >
          <Select
            placeholder="Durum seçiniz"
            className="customer-form-select"
            options={[
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Pasif' },
              { value: 'pending', label: 'Beklemede' },
            ]}
          />
        </Form.Item>

        <div className="customer-form-actions">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="customer-form-submit-button"
          >
            Kaydet
          </Button>
          <Button onClick={onCancel} className="customer-form-cancel-button">
            İptal
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default CustomerForm; 