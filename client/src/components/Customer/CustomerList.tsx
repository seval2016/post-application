import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Space, Tag, Typography, Spin, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
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

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '0532 123 4567',
    address: 'İstanbul, Türkiye',
    status: 'active',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    phone: '0533 234 5678',
    address: 'Ankara, Türkiye',
    status: 'active',
    createdAt: '2023-02-20',
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    phone: '0534 345 6789',
    address: 'İzmir, Türkiye',
    status: 'inactive',
    createdAt: '2023-03-10',
  },
  {
    id: '4',
    name: 'Zeynep Şahin',
    email: 'zeynep@example.com',
    phone: '0535 456 7890',
    address: 'Bursa, Türkiye',
    status: 'active',
    createdAt: '2023-04-05',
  },
  {
    id: '5',
    name: 'Ali Öztürk',
    email: 'ali@example.com',
    phone: '0536 567 8901',
    address: 'Antalya, Türkiye',
    status: 'active',
    createdAt: '2023-05-12',
  },
];

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Fetch customers (mock implementation)
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCustomers(mockCustomers);
    } catch (error) {
      message.error('Müşteriler yüklenirken bir hata oluştu');
      console.error('Müşteri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search text
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.phone.includes(searchText)
  );

  // Table columns
  const columns: ColumnsType<Customer> = [
    {
      title: 'Müşteri Adı',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'E-posta',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Adres',
      dataIndex: 'address',
      key: 'address',
      responsive: ['md'],
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Aktif' : 'Pasif'}
        </Tag>
      ),
    },
    {
      title: 'Kayıt Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
      responsive: ['md'],
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => console.log(`View customer: ${record.id}`)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => console.log(`Edit customer: ${record.id}`)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => console.log(`Delete customer: ${record.id}`)} />
        </Space>
      ),
    },
  ];

  return (
    <Card className="shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Title level={4} className="mb-0">Müşteriler</Title>
          <Text type="secondary">Tüm müşterilerinizi buradan yönetebilirsiniz</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          Yeni Müşteri Ekle
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Müşteri Ara"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="w-full md:w-64"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={filteredCustomers} 
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} müşteri`
          }}
          scroll={{ x: 'max-content' }}
        />
      )}
    </Card>
  );
};

export default CustomerList; 