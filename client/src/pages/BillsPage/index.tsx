import { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Empty,
  Spin,
  message
} from 'antd';
import { 
  FileTextOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import Header from '../../components/Header';
import { billService, Bill } from '../../services/billService';
import { BillsTable, BillsFilters } from '../../components/Bills';

const { Title, Text } = Typography;

const BillsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Faturaları yükle
  const fetchBills = async () => {
    setLoading(true);
    try {
      const data = await billService.getAllBills();
      setBills(data);
    } catch (error) {
      message.error('Faturalar yüklenirken bir hata oluştu');
      console.error('Fatura yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde faturaları getir
  useEffect(() => {
    fetchBills();
  }, []);
  
  // Filtreleme işlemi
  const filteredBills = bills.filter(bill => {
    // Metin araması
    const matchesSearch = 
      bill.id.toLowerCase().includes(searchText.toLowerCase()) ||
      bill.customer.toLowerCase().includes(searchText.toLowerCase());
    
    // Durum filtresi
    const matchesStatus = filterStatus ? bill.status === filterStatus : true;
    
    // Tarih aralığı filtresi
    let matchesDate = true;
    if (dateRange) {
      const billDate = new Date(bill.date);
      const startDate = new Date(dateRange[0]);
      const endDate = new Date(dateRange[1]);
      matchesDate = billDate >= startDate && billDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchText('');
    setFilterStatus(null);
    setDateRange(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Title level={2} className="mb-0 flex items-center">
              <FileTextOutlined className="mr-2" />
              Faturalar
            </Title>
            <Text type="secondary">Tüm faturalarınızı buradan yönetebilirsiniz</Text>
          </div>
          <div className="flex gap-2">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchBills}
              loading={loading}
            >
              Yenile
            </Button>
            <Button type="primary" icon={<FileTextOutlined />}>
              Yeni Fatura Oluştur
            </Button>
          </div>
        </div>

        <Card className="shadow-sm mb-6">
          <BillsFilters
            searchText={searchText}
            setSearchText={setSearchText}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            dateRange={dateRange}
            setDateRange={setDateRange}
            clearFilters={clearFilters}
          />

          {loading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : filteredBills.length > 0 ? (
            <BillsTable bills={filteredBills} loading={loading} />
          ) : (
            <Empty 
              description="Fatura bulunamadı" 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default BillsPage;
