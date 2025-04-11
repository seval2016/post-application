import React from 'react';
import { Table, Space, Button, Tooltip, Tag } from 'antd';
import { EyeOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { Bill } from '../../services/billService';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';

interface BillsTableProps {
  bills: Bill[];
  loading: boolean;
}

const BillsTable: React.FC<BillsTableProps> = ({ bills, loading }) => {
  // Fatura durumuna göre renk belirleme
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ödendi':
        return 'green';
      case 'Beklemede':
        return 'orange';
      case 'İptal Edildi':
        return 'red';
      default:
        return 'default';
    }
  };

  // Tablo sütunları
  const columns = [
    {
      title: 'Fatura No',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Bill, b: Bill) => a.id.localeCompare(b.id),
      responsive: ['md' as Breakpoint],
    },
    {
      title: 'Tarih',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: Bill, b: Bill) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
      responsive: ['sm' as Breakpoint],
    },
    {
      title: 'Müşteri',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a: Bill, b: Bill) => a.customer.localeCompare(b.customer),
    },
    {
      title: 'Ürün Sayısı',
      dataIndex: 'items',
      key: 'items',
      sorter: (a: Bill, b: Bill) => a.items - b.items,
      responsive: ['md' as Breakpoint],
    },
    {
      title: 'Tutar',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a: Bill, b: Bill) => a.amount - b.amount,
      render: (amount: number) => `₺${amount.toFixed(2)}`,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      sorter: (a: Bill, b: Bill) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: unknown, record: Bill) => (
        <Space size="middle">
          <Tooltip title="Görüntüle">
            <Button type="text" icon={<EyeOutlined />} onClick={() => console.log(`View bill: ${record.id}`)} />
          </Tooltip>
          <Tooltip title="İndir">
            <Button type="text" icon={<DownloadOutlined />} onClick={() => console.log(`Download bill: ${record.id}`)} />
          </Tooltip>
          <Tooltip title="Yazdır">
            <Button type="text" icon={<PrinterOutlined />} onClick={() => console.log(`Print bill: ${record.id}`)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table 
        columns={columns} 
        dataSource={bills} 
        rowKey="id"
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Toplam ${total} fatura`
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default BillsTable; 