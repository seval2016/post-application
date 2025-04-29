import React from 'react';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';

interface CustomerInfoProps {
  form: FormInstance;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="email"
        label="E-posta"
        rules={[
          { required: true, message: 'Lütfen e-posta adresinizi giriniz' },
          { type: 'email', message: 'Geçerli bir e-posta adresi giriniz' }
        ]}
      >
        <Input placeholder="ornek@email.com" />
      </Form.Item>

      <Form.Item
        name="companyName"
        label="Firma Adı (Opsiyonel)"
      >
        <Input placeholder="Firma Adı" />
      </Form.Item>

      <Form.Item
        name="taxNumber"
        label="Vergi Numarası (Opsiyonel)"
      >
        <Input placeholder="Vergi Numarası" />
      </Form.Item>

      <Form.Item
        name="taxOffice"
        label="Vergi Dairesi (Opsiyonel)"
      >
        <Input placeholder="Vergi Dairesi" />
      </Form.Item>

      <Form.Item
        name="notes"
        label="Sipariş Notu (Opsiyonel)"
      >
        <Input.TextArea placeholder="Siparişinizle ilgili eklemek istediğiniz notlar" rows={3} />
      </Form.Item>
    </Form>
  );
};

export default CustomerInfo; 