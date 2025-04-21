import React from 'react';
import { Table, Space, Button, Tooltip, Tag } from 'antd';
import { EyeOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { Bill } from '../../services/billService';
import type { Breakpoint } from 'antd/es/_util/responsiveObserver';
import '../../styles/components/Bills/BillsTable.css';

interface BillsTableProps {
  bills: Bill[];
  loading: boolean;
}

const BillsTable: React.FC<BillsTableProps> = ({ bills, loading }) => {
  // Fatura durumuna göre renk belirleme
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Ödendi':
        return 'bills-status-tag bills-status-tag-paid';
      case 'Beklemede':
        return 'bills-status-tag bills-status-tag-pending';
      case 'İptal Edildi':
        return 'bills-status-tag bills-status-tag-cancelled';
      default:
        return 'bills-status-tag';
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
      className: 'bills-table-cell',
    },
    {
      title: 'Tarih',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: Bill, b: Bill) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
      responsive: ['sm' as Breakpoint],
      className: 'bills-table-cell',
    },
    {
      title: 'Müşteri',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a: Bill, b: Bill) => a.customer.localeCompare(b.customer),
      className: 'bills-table-cell',
    },
    {
      title: 'Ürün Sayısı',
      dataIndex: 'items',
      key: 'items',
      sorter: (a: Bill, b: Bill) => a.items - b.items,
      responsive: ['md' as Breakpoint],
      className: 'bills-table-cell',
    },
    {
      title: 'Tutar',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a: Bill, b: Bill) => a.amount - b.amount,
      render: (amount: number) => `₺${amount.toFixed(2)}`,
      className: 'bills-table-cell',
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      sorter: (a: Bill, b: Bill) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <Tag className={getStatusClass(status)}>{status}</Tag>
      ),
      className: 'bills-table-cell',
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: unknown, record: Bill) => (
        <Space className="bills-action-buttons">
          <Tooltip title="Görüntüle">
            <Button type="text" icon={<EyeOutlined />} className="bills-action-button" onClick={() => console.log(`View bill: ${record.id}`)} />
          </Tooltip>
          <Tooltip title="İndir">
            <Button type="text" icon={<DownloadOutlined />} className="bills-action-button" onClick={() => console.log(`Download bill: ${record.id}`)} />
          </Tooltip>
          <Tooltip title="Yazdır">
            <Button type="text" icon={<PrinterOutlined />} className="bills-action-button" onClick={() => console.log(`Print bill: ${record.id}`)} />
          </Tooltip>
        </Space>
      ),
      className: 'bills-table-cell',
    },
  ];

  return (
    <div className="bills-table-container">
      <div className="bills-table-wrapper">
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
    </div>
  );
};

export default BillsTable; 