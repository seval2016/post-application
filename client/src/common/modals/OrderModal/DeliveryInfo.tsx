import React, { useState } from 'react';
import { Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd';

interface DeliveryInfoProps {
  form: FormInstance;
}

interface District {
  value: string;
  label: string;
}

interface Districts {
  [key: string]: District[];
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ form }) => {
  const [selectedCity, setSelectedCity] = useState<string>('');

  const cities = [
    { value: 'istanbul', label: 'İstanbul' },
    { value: 'ankara', label: 'Ankara' },
    { value: 'izmir', label: 'İzmir' }
  ];

  const districts: Districts = {
    istanbul: [
      { value: 'kadikoy', label: 'Kadıköy' },
      { value: 'besiktas', label: 'Beşiktaş' },
      { value: 'sisli', label: 'Şişli' }
    ],
    ankara: [
      { value: 'cankaya', label: 'Çankaya' },
      { value: 'yenimahalle', label: 'Yenimahalle' },
      { value: 'kecioren', label: 'Keçiören' }
    ],
    izmir: [
      { value: 'karsiyaka', label: 'Karşıyaka' },
      { value: 'bornova', label: 'Bornova' },
      { value: 'konak', label: 'Konak' }
    ]
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    form.setFieldsValue({ district: undefined });
  };

  return (
    <>
      <Form.Item
        name="address"
        label="Adres"
        rules={[{ required: true, message: 'Lütfen adresinizi giriniz' }]}
      >
        <Input.TextArea placeholder="Açık adresinizi giriniz" rows={3} />
      </Form.Item>

      <Form.Item
        name="city"
        label="Şehir"
        rules={[{ required: true, message: 'Lütfen şehir seçiniz' }]}
      >
        <Select
          placeholder="Şehir seçiniz"
          onChange={handleCityChange}
          options={cities}
        />
      </Form.Item>

      <Form.Item
        name="district"
        label="İlçe"
        rules={[{ required: true, message: 'Lütfen ilçe seçiniz' }]}
      >
        <Select
          placeholder="İlçe seçiniz"
          options={districts[selectedCity] || []}
          disabled={!selectedCity}
        />
      </Form.Item>

      <Form.Item
        name="postalCode"
        label="Posta Kodu"
        rules={[
          { required: true, message: 'Lütfen posta kodunuzu giriniz' },
          { pattern: /^\d{5}$/, message: 'Posta kodu 5 haneli olmalıdır' }
        ]}
      >
        <Input placeholder="34000" maxLength={5} />
      </Form.Item>
    </>
  );
};

export default DeliveryInfo; 