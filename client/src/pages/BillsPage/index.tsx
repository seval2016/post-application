import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Space, Modal, message, Card, Typography, Row, Col, Input } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import billService, { Bill } from '../../services/billService';
import BillDetailModal from './BillDetailModal';
import Header from '../../components/Header';
import ErrorBoundary from '../../components/ErrorBoundary';
import '../../styles/BillsPage/BillsPage.css';

const { Title, Text } = Typography;
const { Search } = Input;

const BillsPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await billService.getAllBills();
      setBills(data || []);
    } catch (error) {
      message.error(`Faturalar yüklenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDetailModalVisible(true);
  };

  const handleDeleteBill = async (id: string) => {
    try {
      await billService.deleteBill(id);
      message.success('Fatura başarıyla silindi');
      fetchBills();
    } catch (error) {
      message.error(`Fatura silinirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredBills = React.useMemo(() => {
    if (!bills) return [];
    return bills.filter(bill => 
      bill.billNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      bill.customer.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [bills, searchText]);

  const columns = [
    {
      title: 'Fatura No',
      dataIndex: 'billNumber',
      key: 'billNumber',
    },
    {
      title: 'Müşteri',
      dataIndex: ['customer', 'name'],
      key: 'customerName',
    },
    {
      title: 'Tutar',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `₺${total.toFixed(2)}`,
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: Bill['status']) => (
        <Badge 
          status={billService.getStatusColor(status) as "success" | "processing" | "error" | "warning" | "default"} 
          text={billService.getStatusText(status)} 
        />
      ),
    },
    {
      title: 'Tarih',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: unknown, record: Bill) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewBill(record)}
          >
            Görüntüle
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Faturayı Sil',
                content: 'Bu faturayı silmek istediğinizden emin misiniz?',
                onOk: () => handleDeleteBill(record._id),
              });
            }}
          >
            Sil
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="bills-page">
      <Header />
      <div className="bills-container">
        <Card className="bills-card">
          <Row justify="space-between" align="middle" className="bills-header">
            <Col>
              <Title level={2} className="bills-title">
                <FileTextOutlined /> Faturalar
              </Title>
              <Text type="secondary">Toplam {bills.length} fatura</Text>
            </Col>
            <Col>
              <Search
                placeholder="Fatura veya müşteri ara..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                className="bills-search"
              />
            </Col>
          </Row>
          
          <Table
            columns={columns}
            dataSource={filteredBills}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Toplam ${total} fatura`
            }}
            className="bills-table"
          />
        </Card>
      </div>
      
      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          visible={isDetailModalVisible}
          onClose={() => {
            setIsDetailModalVisible(false);
            setSelectedBill(null);
          }}
        />
      )}
    </div>
  );
};

export default function BillsPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <BillsPage />
    </ErrorBoundary>
  );
}
