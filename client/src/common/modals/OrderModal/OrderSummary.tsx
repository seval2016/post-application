import React from 'react';
import { Table } from 'antd';
import { formatPrice } from '../../../utils/format';

interface OrderSummaryProps {
  values: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      total: number;
    }>;
    subtotal: number;
    vat: number;
    total: number;
  };
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ values }) => {
  const columns = [
    {
      title: 'Ürün',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Adet',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Fiyat',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatPrice(price),
    },
    {
      title: 'Toplam',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => formatPrice(total),
    },
  ];

  return (
    <div>
      <Table
        dataSource={values.items}
        columns={columns}
        pagination={false}
        rowKey="id"
      />
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Ara Toplam:</span>
          <span>{formatPrice(values.subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>KDV (%18):</span>
          <span>{formatPrice(values.vat)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontWeight: 'bold' }}>
          <span>Toplam:</span>
          <span>{formatPrice(values.total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 