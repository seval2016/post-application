import React, { useState, useEffect } from 'react';
import { Table, Input, Select, DatePicker, Button, Space, Tag, message } from 'antd';
import { SearchOutlined, ReloadOutlined, FileTextOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import Header from '../../components/Header';
import PageHeader from '../../common/components/PageHeader';
import { billService, Bill } from '../../services/billService';

const { RangePicker } = DatePicker;

const BillsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await billService.getAllBills();
      setBills(data);
    } catch {
      message.error('Faturalar yüklenirken bir hata oluştu');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ödendi':
        return 'success';
      case 'Beklemede':
        return 'warning';
      case 'İptal Edildi':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Fatura No',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Bill, b: Bill) => a.id.localeCompare(b.id),
    },
    {
      title: 'Müşteri',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a: Bill, b: Bill) => a.customer.localeCompare(b.customer),
    },
    {
      title: 'Tarih',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: Bill, b: Bill) => new Date(a.date).getTime() - new Date(b.date).getTime(),
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
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
  ];

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.customer.toLowerCase().includes(searchText.toLowerCase()) ||
                         bill.id.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    
    const matchesDateRange = !dateRange || !dateRange[0] || !dateRange[1] || (
      new Date(bill.date) >= dateRange[0].toDate() &&
      new Date(bill.date) <= dateRange[1].toDate()
    );

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full mt-[84px] overflow-y-auto">
        <PageHeader 
          icon={FileTextOutlined}
          title="Faturalar"
              subtitle="Müşteri faturalarını görüntüleyin ve yönetin"
        />
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <Space className="w-full mb-4" size="middle">
            <Input
              placeholder="Fatura veya müşteri ara..."
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
                { value: 'Ödendi', label: 'Ödendi' },
                { value: 'Beklemede', label: 'Beklemede' },
                { value: 'İptal Edildi', label: 'İptal Edildi' },
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
            dataSource={filteredBills}
            rowKey="id"
            loading={loading}
            pagination={{
              total: filteredBills.length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Toplam ${total} fatura`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BillsPage;
