import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Space, Tag, Typography, Spin, message, Modal, Form, Select } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import '../../../styles/components/Customer/CustomerList.css';

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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Fetch customers (mock implementation)
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCustomers(mockCustomers);
    } catch {
      message.error('Müşteriler yüklenirken bir hata oluştu');
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
      className: 'customer-name-cell',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'E-posta',
      dataIndex: 'email',
      key: 'email',
      className: 'customer-email-cell',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      className: 'customer-phone-cell',
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
        <Tag className={`status-${status.toLowerCase()}`}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Kayıt Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: 'customer-date-cell',
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
      responsive: ['md'],
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space className="customer-action-buttons">
          <Button
            type="text"
            icon={<EyeOutlined />}
            className="action-button-view"
            onClick={() => handleView(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            className="action-button-edit"
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="action-button-delete"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const handleView = (record: Customer) => {
    setSelectedCustomer(record);
    setIsViewModalVisible(true);
  };

  const handleEdit = (record: Customer) => {
    setSelectedCustomer(record);
    setIsEditModalVisible(true);
  };

  const handleDelete = (record: Customer) => {
    setSelectedCustomer(record);
    setIsDeleteModalVisible(true);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    // Implement search logic here
  };

  return (
    <Card className="customer-list-container">
      <div className="customer-list-header">
        <div className="customer-list-title-wrapper">
          <Title level={4} className="customer-list-title">Müşteriler</Title>
          <Text type="secondary" className="customer-list-subtitle">Tüm müşterilerinizi buradan yönetebilirsiniz</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} className="customer-list-add-button">
          Yeni Müşteri Ekle
        </Button>
      </div>

      <div className="customer-list-search">
        <Input
          placeholder="Müşteri Ara"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          className="customer-list-search-input"
        />
      </div>

      {loading ? (
        <div className="customer-list-loading">
          <Spin size="large" />
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={filteredCustomers} 
          rowKey="id"
          className="customer-list-table"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} müşteri`,
            className: "customer-list-pagination"
          }}
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: (
              <div className="customer-list-empty">
                <p>No customers found</p>
              </div>
            ),
          }}
        />
      )}

      {/* View Customer Modal */}
      <Modal
        title="Müşteri Detayları"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Kapat
          </Button>
        ]}
      >
        {selectedCustomer && (
          <div>
            <p><strong>Ad:</strong> {selectedCustomer.name}</p>
            <p><strong>E-posta:</strong> {selectedCustomer.email}</p>
            <p><strong>Telefon:</strong> {selectedCustomer.phone}</p>
            <p><strong>Adres:</strong> {selectedCustomer.address}</p>
            <p><strong>Durum:</strong> {selectedCustomer.status}</p>
            <p><strong>Kayıt Tarihi:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString('tr-TR')}</p>
          </div>
        )}
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        title="Müşteri Düzenle"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
            İptal
          </Button>,
          <Button key="save" type="primary" onClick={() => {
            message.success('Müşteri başarıyla güncellendi');
            setIsEditModalVisible(false);
          }}>
            Kaydet
          </Button>
        ]}
      >
        {selectedCustomer && (
          <Form layout="vertical">
            <Form.Item label="Ad" initialValue={selectedCustomer.name}>
              <Input />
            </Form.Item>
            <Form.Item label="E-posta" initialValue={selectedCustomer.email}>
              <Input />
            </Form.Item>
            <Form.Item label="Telefon" initialValue={selectedCustomer.phone}>
              <Input />
            </Form.Item>
            <Form.Item label="Adres" initialValue={selectedCustomer.address}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Durum" initialValue={selectedCustomer.status}>
              <Select>
                <Select.Option value="active">Aktif</Select.Option>
                <Select.Option value="inactive">Pasif</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Delete Customer Modal */}
      <Modal
        title="Müşteri Sil"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
            İptal
          </Button>,
          <Button 
            key="delete" 
            type="primary" 
            danger 
            onClick={() => {
              message.success('Müşteri başarıyla silindi');
              setIsDeleteModalVisible(false);
            }}
          >
            Sil
          </Button>
        ]}
      >
        {selectedCustomer && (
          <p>
            <strong>{selectedCustomer.name}</strong> isimli müşteriyi silmek istediğinize emin misiniz?
            Bu işlem geri alınamaz.
          </p>
        )}
      </Modal>
    </Card>
  );
};

export default CustomerList; 