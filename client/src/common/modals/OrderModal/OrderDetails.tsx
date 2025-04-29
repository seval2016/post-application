import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface OrderItem {
  key: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderDetailsProps {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  items,
  subtotal,
  tax,
  total,
}) => {
  const columns: ColumnsType<OrderItem> = [
    {
      title: 'Ürün',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Adet',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
    },
    {
      title: 'Fiyat',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price: number) => `₺${price.toFixed(2)}`,
    },
    {
      title: 'Toplam',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (total: number) => `₺${total.toFixed(2)}`,
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={items}
        pagination={false}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                Ara Toplam
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                ₺{subtotal.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                KDV
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                ₺{tax.toFixed(2)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <strong>Toplam</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <strong>₺{total.toFixed(2)}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};

export default OrderDetails; 