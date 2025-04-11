import React, { useState } from 'react';
import { Form, Input, Button, Card, Select, Space, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface CustomerFormValues {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
}

interface CustomerFormProps {
  initialValues?: CustomerFormValues;
  onSubmit: (values: CustomerFormValues) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: CustomerFormValues) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(values);
      message.success('Müşteri başarıyla kaydedildi');
    } catch (error) {
      message.error('Müşteri kaydedilirken bir hata oluştu');
      console.error('Müşteri kaydetme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <div className="mb-6">
        <Title level={4} className="mb-0">
          {initialValues?.id ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
        </Title>
        <Text type="secondary">
          {initialValues?.id 
            ? 'Müşteri bilgilerini güncelleyin' 
            : 'Yeni bir müşteri eklemek için aşağıdaki formu doldurun'}
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Müşteri Adı"
          rules={[{ required: true, message: 'Lütfen müşteri adını girin' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Müşteri adı" />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-posta"
          rules={[
            { required: true, message: 'Lütfen e-posta adresini girin' },
            { type: 'email', message: 'Geçerli bir e-posta adresi girin' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="E-posta adresi" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Telefon"
          rules={[{ required: true, message: 'Lütfen telefon numarasını girin' }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Telefon numarası" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Adres"
          rules={[{ required: true, message: 'Lütfen adresi girin' }]}
        >
          <Input.TextArea 
            placeholder="Adres" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Durum"
          rules={[{ required: true, message: 'Lütfen durumu seçin' }]}
        >
          <Select placeholder="Durum seçin">
            <Option value="active">Aktif</Option>
            <Option value="inactive">Pasif</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {initialValues?.id ? 'Güncelle' : 'Kaydet'}
            </Button>
            <Button onClick={onCancel}>İptal</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CustomerForm; 