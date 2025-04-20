import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import Header from '../../components/Header';
import PageHeader from '../../common/components/PageHeader';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
}

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '0555-555-5555',
      address: 'İstanbul, Türkiye',
      status: 'Aktif',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Ayşe Demir',
      email: 'ayse@example.com',
      phone: '0555-555-5556',
      address: 'Ankara, Türkiye',
      status: 'Aktif',
      createdAt: '2024-01-16',
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalVisible(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    Modal.confirm({
      title: 'Müşteriyi Sil',
      content: `${customer.name} isimli müşteriyi silmek istediğinize emin misiniz?`,
      okText: 'Evet',
      cancelText: 'Hayır',
      onOk: () => {
        setCustomers(customers.filter(c => c.id !== customer.id));
        message.success('Müşteri başarıyla silindi');
      },
    });
  };

  const handleFormSubmit = (values: Customer) => {
    if (selectedCustomer) {
      setCustomers(customers.map(c => 
        c.id === selectedCustomer.id ? { ...values, id: c.id } : c
      ));
      message.success('Müşteri başarıyla güncellendi');
    } else {
      const newCustomer = {
        ...values,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomers([...customers, newCustomer]);
      message.success('Müşteri başarıyla eklendi');
    }
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Müşteri Adı',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Customer, b: Customer) => a.name.localeCompare(b.name),
    },
    {
      title: 'E-posta',
      dataIndex: 'email',
      key: 'email',
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
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Aktif' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Kayıt Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Customer, b: Customer) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: unknown, record: Customer) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditCustomer(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCustomer(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full mt-[84px] overflow-y-auto">
        <PageHeader 
          icon={UserOutlined}
          title="Müşteriler"
          subtitle="Müşteri bilgilerini görüntüleyin ve yönetin"
        />
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="mb-4">
            <Button type="primary" onClick={handleAddCustomer}>
              Yeni Müşteri Ekle
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={customers}
            rowKey="id"
            pagination={{
              total: customers.length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Toplam ${total} müşteri`,
            }}
          />
        </div>

        <Modal
          title={selectedCustomer ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
          >
            <Form.Item
              name="name"
              label="Müşteri Adı"
              rules={[{ required: true, message: 'Lütfen müşteri adını girin' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="E-posta"
              rules={[
                { required: true, message: 'Lütfen e-posta adresini girin' },
                { type: 'email', message: 'Geçerli bir e-posta adresi girin' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Telefon"
              rules={[{ required: true, message: 'Lütfen telefon numarasını girin' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Adres"
              rules={[{ required: true, message: 'Lütfen adresi girin' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="status"
              label="Durum"
              initialValue="Aktif"
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {selectedCustomer ? 'Güncelle' : 'Ekle'}
                </Button>
                <Button onClick={() => setIsModalVisible(false)}>
                  İptal
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CustomerPage;
