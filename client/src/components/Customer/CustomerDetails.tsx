import React from 'react';
import { Card, Descriptions, Button, Space, Tag, Typography, Table } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Order {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
}

interface CustomerDetailsProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
}

// Mock data for customer orders
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2023-06-15',
    amount: 1250.75,
    status: 'completed',
  },
  {
    id: 'ORD-002',
    date: '2023-07-22',
    amount: 850.50,
    status: 'completed',
  },
  {
    id: 'ORD-003',
    date: '2023-08-10',
    amount: 2100.25,
    status: 'pending',
  },
];

const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer, onEdit, onDelete }) => {
  // Table columns for orders
  const columns: ColumnsType<Order> = [
    {
      title: 'Sipariş No',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tarih',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
    },
    {
      title: 'Tutar',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `₺${amount.toFixed(2)}`,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = 'Bilinmiyor';
        
        switch (status) {
          case 'completed':
            color = 'green';
            text = 'Tamamlandı';
            break;
          case 'pending':
            color = 'orange';
            text = 'Beklemede';
            break;
          case 'cancelled':
            color = 'red';
            text = 'İptal Edildi';
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <Title level={4} className="mb-0 flex items-center">
              <UserOutlined className="mr-2" />
              {customer.name}
            </Title>
            <Text type="secondary">Müşteri Detayları</Text>
          </div>
          <Space>
            <Button icon={<EditOutlined />} onClick={onEdit}>
              Düzenle
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
              Sil
            </Button>
          </Space>
        </div>

        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
          <Descriptions.Item label="Müşteri ID">{customer.id}</Descriptions.Item>
          <Descriptions.Item label="Durum">
            <Tag color={customer.status === 'active' ? 'green' : 'red'}>
              {customer.status === 'active' ? 'Aktif' : 'Pasif'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="E-posta">
            <MailOutlined className="mr-2" />
            {customer.email}
          </Descriptions.Item>
          <Descriptions.Item label="Telefon">
            <PhoneOutlined className="mr-2" />
            {customer.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Adres" span={2}>
            <EnvironmentOutlined className="mr-2" />
            {customer.address}
          </Descriptions.Item>
          <Descriptions.Item label="Kayıt Tarihi">
            {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="shadow-sm">
        <Title level={4} className="mb-6">Sipariş Geçmişi</Title>
        <Table 
          columns={columns} 
          dataSource={mockOrders} 
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default CustomerDetails; 