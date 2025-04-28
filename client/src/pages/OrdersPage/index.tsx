import { useState, useEffect } from 'react';
import { Table, Input, Select, DatePicker, Button, Space, Tag, message, Dropdown } from 'antd';
import { SearchOutlined, ReloadOutlined, ShoppingOutlined, DownOutlined, CheckOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import Header from '../../components/Header';
import PageHeader from '../../common/PageHeader';
import { getOrders, updateOrderStatus } from '../../services/orderService';

const { RangePicker } = DatePicker;

interface Order {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  vat: number;
  shipping: number;
  grandTotal: number;
  paymentMethod: string;
  shippingMethod: string;
  status: string;
  createdAt: string;
}

const OrdersPage = () => {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch {
      message.error('Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value: string) => {
    setFilterStatus(value);
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setFilterStatus('all');
    setDateRange(null);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setLoading(true);
      const response = await updateOrderStatus(orderId, newStatus);
      
      if (response.success) {
        // Yerel state'i güncelle
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus } 
              : order
          )
        );
        
        message.success('Sipariş durumu güncellendi');
      } else {
        message.error(response.error || 'Sipariş durumu güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Sipariş durumu güncellenirken hata:', error);
      message.error('Sipariş durumu güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusMenuItems = (orderId: string, currentStatus: string) => {
    const statuses = [
      { key: 'pending', label: 'Beklemede' },
      { key: 'processing', label: 'İşleniyor' },
      { key: 'shipped', label: 'Kargoya Verildi' },
      { key: 'delivered', label: 'Teslim Edildi' },
      { key: 'cancelled', label: 'İptal Edildi' }
    ];

    return statuses.map(status => ({
      key: status.key,
      label: status.label,
      icon: status.key === currentStatus ? <CheckOutlined /> : null,
      onClick: () => handleStatusUpdate(orderId, status.key)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'processing':
        return 'processing';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Teslim Edildi';
      case 'processing':
        return 'İşleniyor';
      case 'pending':
        return 'Beklemede';
      case 'cancelled':
        return 'İptal Edildi';
      case 'shipped':
        return 'Kargoya Verildi';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Sipariş ID',
      dataIndex: '_id',
      key: '_id',
      width: 100,
    },
    {
      title: 'Müşteri',
      key: 'customer',
      render: (record: Order) => `${record.customer.firstName} ${record.customer.lastName}`,
      sorter: (a: Order, b: Order) => 
        `${a.customer.firstName} ${a.customer.lastName}`.localeCompare(`${b.customer.firstName} ${b.customer.lastName}`),
    },
    {
      title: 'Tarih',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
      sorter: (a: Order, b: Order) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Tutar',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      sorter: (a: Order, b: Order) => a.grandTotal - b.grandTotal,
      render: (amount: number) => `₺${amount.toFixed(2)}`,
    },
    {
      title: 'Ödeme Yöntemi',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => {
        const methods = {
          credit_card: 'Kredi Kartı',
          bank_transfer: 'Havale/EFT',
          cash: 'Nakit'
        };
        return methods[method as keyof typeof methods] || method;
      }
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Order) => (
        <Dropdown 
          menu={{ items: getStatusMenuItems(record._id, status) }} 
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text" className="flex items-center">
            <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            <DownOutlined className="ml-1" />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const filteredOrders = orders.filter(order => {
    const customerName = `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase();
    const matchesSearch = customerName.includes(searchText.toLowerCase()) ||
                         order._id.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    const matchesDateRange = !dateRange || !dateRange[0] || !dateRange[1] || (
      new Date(order.createdAt) >= dateRange[0].toDate() &&
      new Date(order.createdAt) <= dateRange[1].toDate()
    );

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full mt-[84px] overflow-y-auto">
        <PageHeader 
          icon={ShoppingOutlined}
          title="Siparişler"
          subtitle="Müşteri siparişlerini görüntüleyin ve yönetin"
        />
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <Space className="w-full mb-4" size="middle">
            <Input
              placeholder="Sipariş ID veya müşteri ara..."
              prefix={<SearchOutlined />}
              onChange={e => handleSearch(e.target.value)}
              value={searchText}
              className="max-w-xs"
            />
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={handleStatusFilter}
              value={filterStatus}
              options={[
                { value: 'all', label: 'Tüm Durumlar' },
                { value: 'delivered', label: 'Teslim Edildi' },
                { value: 'processing', label: 'İşleniyor' },
                { value: 'pending', label: 'Beklemede' },
                { value: 'shipped', label: 'Kargoya Verildi' },
                { value: 'cancelled', label: 'İptal Edildi' },
              ]}
            />
            <RangePicker onChange={handleDateRangeChange} />
            <Button 
              icon={<ReloadOutlined />} 
              onClick={handleClearFilters}
            >
              Filtreleri Temizle
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="_id"
            loading={loading}
            pagination={{
              total: filteredOrders.length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Toplam ${total} sipariş`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersPage; 