import React from 'react';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';

interface DeliveryInfoProps {
  form: FormInstance;
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="fullName"
        label="Ad Soyad"
        rules={[{ required: true, message: 'Lütfen adınızı ve soyadınızı giriniz' }]}
      >
        <Input placeholder="Ad Soyad" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Telefon"
        rules={[{ required: true, message: 'Lütfen telefon numaranızı giriniz' }]}
      >
        <Input placeholder="0555 555 55 55" />
      </Form.Item>

      <Form.Item
        name="address"
        label="Adres"
        rules={[{ required: true, message: 'Lütfen adresinizi giriniz' }]}
      >
        <Input.TextArea placeholder="Adres" rows={4} />
      </Form.Item>

      <Form.Item
        name="city"
        label="Şehir"
        rules={[{ required: true, message: 'Lütfen şehrinizi giriniz' }]}
      >
        <Input placeholder="Şehir" />
      </Form.Item>

      <Form.Item
        name="district"
        label="İlçe"
        rules={[{ required: true, message: 'Lütfen ilçenizi giriniz' }]}
      >
        <Input placeholder="İlçe" />
      </Form.Item>

      <Form.Item
        name="postalCode"
        label="Posta Kodu"
        rules={[{ required: true, message: 'Lütfen posta kodunuzu giriniz' }]}
      >
        <Input placeholder="34000" />
      </Form.Item>
    </Form>
  );
};

export default DeliveryInfo; 