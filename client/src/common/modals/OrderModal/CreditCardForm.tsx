import React from 'react';
import { Form, Input } from 'antd';

type CreditCardFormProps = object;

const CreditCardForm: React.FC<CreditCardFormProps> = () => {
  return (
    <div>
      <Form.Item
        name="cardNumber"
        label="Kart Numarası"
        rules={[{ required: true, message: 'Lütfen kart numaranızı giriniz' }]}
      >
        <Input placeholder="1234 5678 9012 3456" maxLength={19} />
      </Form.Item>

      <Form.Item
        name="expiryDate"
        label="Son Kullanma Tarihi"
        rules={[{ required: true, message: 'Lütfen son kullanma tarihini giriniz' }]}
      >
        <Input placeholder="MM/YY" maxLength={5} />
      </Form.Item>

      <Form.Item
        name="cvv"
        label="CVV"
        rules={[{ required: true, message: 'Lütfen CVV kodunu giriniz' }]}
      >
        <Input placeholder="123" maxLength={3} />
      </Form.Item>

      <Form.Item
        name="cardholderName"
        label="Kart Sahibinin Adı"
        rules={[{ required: true, message: 'Lütfen kart sahibinin adını giriniz' }]}
      >
        <Input placeholder="Ad Soyad" />
      </Form.Item>
    </div>
  );
};

export default CreditCardForm; 