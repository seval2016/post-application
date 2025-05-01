import React from 'react';
import { Form, Input } from 'antd';

const CustomerInfo: React.FC = () => {
  return (
    <>
      <Form.Item
        name="fullName"
        label="Ad Soyad"
        rules={[
          { required: true, message: 'Lütfen adınızı ve soyadınızı giriniz' },
          { min: 5, message: 'Ad soyad en az 5 karakter olmalıdır' },
          { pattern: /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, message: 'Ad soyad sadece harflerden oluşmalıdır' },
          { validator: (_, value) => {
            if (value && value.trim().split(' ').length < 2) {
              return Promise.reject('Lütfen hem adınızı hem soyadınızı giriniz');
            }
            return Promise.resolve();
          }}
        ]}
      >
        <Input placeholder="Örn: Ahmet Yılmaz" />
      </Form.Item>

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
        name="phone"
        label="Telefon"
        rules={[
          { required: true, message: 'Lütfen telefon numaranızı giriniz' },
          { pattern: /^[0-9]{10}$/, message: 'Telefon numarası 10 haneli olmalıdır' }
        ]}
      >
        <Input placeholder="5XX XXX XX XX" maxLength={10} />
      </Form.Item>

      <Form.Item
        name="companyName"
        label="Firma Adı (Opsiyonel)"
      >
        <Input placeholder="Firma adını giriniz" />
      </Form.Item>

      <Form.Item
        name="taxNumber"
        label="Vergi Numarası (Opsiyonel)"
        rules={[
          { pattern: /^[0-9]{10}$/, message: 'Vergi numarası 10 haneli olmalıdır' }
        ]}
      >
        <Input placeholder="Vergi numarasını giriniz" maxLength={10} />
      </Form.Item>

      <Form.Item
        name="taxOffice"
        label="Vergi Dairesi (Opsiyonel)"
      >
        <Input placeholder="Vergi dairesini giriniz" />
      </Form.Item>

      <Form.Item
        name="notes"
        label="Sipariş Notu (Opsiyonel)"
      >
        <Input.TextArea 
          placeholder="Siparişinizle ilgili eklemek istediğiniz notlar" 
          rows={3}
          maxLength={500}
          showCount
        />
      </Form.Item>
    </>
  );
};

export default CustomerInfo; 