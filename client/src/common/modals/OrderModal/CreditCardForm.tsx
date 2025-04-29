import React from 'react';
import { Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd';

interface CreditCardFormProps {
  form: FormInstance;
  onFinish: () => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ form, onFinish }) => {
  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={onFinish}
      requiredMark={false}
    >
      <Form.Item
        name="cardNumber"
        label="Kart Numarası"
        rules={[
          { required: true, message: 'Lütfen kart numarasını giriniz' },
          { len: 16, message: 'Kart numarası 16 haneli olmalıdır' }
        ]}
      >
        <Input placeholder="1234 5678 9012 3456" maxLength={16} />
      </Form.Item>

      <Form.Item
        name="expiryDate"
        label="Son Kullanma Tarihi"
        rules={[
          { required: true, message: 'Lütfen son kullanma tarihini giriniz' },
          { pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/, message: 'GG/YY formatında giriniz' }
        ]}
      >
        <Input placeholder="MM/YY" maxLength={5} />
      </Form.Item>

      <Form.Item
        name="cvv"
        label="CVV"
        rules={[
          { required: true, message: 'Lütfen CVV kodunu giriniz' },
          { pattern: /^[0-9]{3,4}$/, message: 'CVV 3 veya 4 haneli olmalıdır' }
        ]}
      >
        <Input placeholder="123" maxLength={4} />
      </Form.Item>

      <Form.Item
        name="cardholderName"
        label="Kart Üzerindeki İsim"
        rules={[{ required: true, message: 'Lütfen kart sahibinin adını giriniz' }]}
      >
        <Input placeholder="JOHN DOE" />
      </Form.Item>

      <Form.Item
        name="installment"
        label="Taksit Seçenekleri"
        rules={[{ required: true, message: 'Lütfen taksit seçeneği seçiniz' }]}
      >
        <Select>
          <Select.Option value="1">Tek Çekim</Select.Option>
          <Select.Option value="3">3 Taksit</Select.Option>
          <Select.Option value="6">6 Taksit</Select.Option>
          <Select.Option value="9">9 Taksit</Select.Option>
          <Select.Option value="12">12 Taksit</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default CreditCardForm; 