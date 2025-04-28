import { Avatar, Space, Card, Table, Spin, Row, Col, Statistic, DatePicker } from 'antd';
import { 
  UserOutlined, 
  BarChartOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined 
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Header from '../../components/Header';
import { RootState } from '../../redux/store';
import PageHeader from '../../common/PageHeader';
import '../../styles/pages/StatisticsPage.css';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const { RangePicker } = DatePicker;

const StatisticsPage = () => {
  const admin = useSelector((state: RootState) => state.auth.user);
  const loading = false;
  const error = null;

  // Örnek veriler
  const salesData = [
    { id: 1, name: 'Ocak', value: 4000 },
    { id: 2, name: 'Şubat', value: 3000 },
    { id: 3, name: 'Mart', value: 5000 },
    { id: 4, name: 'Nisan', value: 4500 },
    { id: 5, name: 'Mayıs', value: 6000 },
    { id: 6, name: 'Haziran', value: 5500 },
  ];

  const categoryData = [
    { id: 1, name: 'Elektronik', value: 400 },
    { id: 2, name: 'Giyim', value: 300 },
    { id: 3, name: 'Gıda', value: 300 },
    { id: 4, name: 'Kozmetik', value: 200 },
    { id: 5, name: 'Ev Eşyaları', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const columns = [
    {
      title: 'Ay',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Satış',
      dataIndex: 'value',
      key: 'value',
      width: '60%',
      render: (value: number) => `₺${value.toFixed(2)}`,
    },
  ];

  if (loading) {
    return (
      <div className="statistics-page-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-page-error">
        <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 sm:pb-8 w-full mt-[84px] overflow-y-auto">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-8">
          <Space align="center" size="middle" className="flex flex-col sm:flex-row">
            <Avatar size={48} icon={<UserOutlined />} className="bg-indigo-500" />
            <div className="text-center sm:text-left">
              <span className="text-lg font-medium">
                Hoş geldin, {admin?.name || 'Admin'}
              </span>
              <div className="text-sm text-gray-500">
                İstatistiklerinizi görüntülemek için aşağıdaki grafikleri inceleyebilirsiniz.
              </div>
            </div>
          </Space>
        </div>
        <PageHeader 
          icon={BarChartOutlined}
          title="İstatistikler"
        />

        {/* Tarih Filtresi */}
        <div className="mb-6">
          <RangePicker className="w-full sm:w-auto" />
        </div>

        {/* Satış Kartları */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6} className="mb-6 sm:mb-0">
            <Card className="statistics-card h-full">
              <Statistic
                title="Toplam Satış"
                value={12500}
                prefix={<DollarOutlined />}
                suffix="₺"
                valueStyle={{ color: '#3f8600' }}
              />
              <div className="statistics-growth statistics-growth-green">
                <ArrowUpOutlined /> 12.5% geçen aya göre
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} className="mb-6 sm:mb-0">
            <Card className="statistics-card h-full">
              <Statistic
                title="Toplam Sipariş"
                value={342}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <div className="statistics-growth statistics-growth-blue">
                <ArrowUpOutlined /> 8.3% geçen aya göre
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} className="mb-6 sm:mb-0">
            <Card className="statistics-card h-full">
              <Statistic
                title="Ortalama Sipariş Değeri"
                value={36.55}
                prefix={<DollarOutlined />}
                suffix="₺"
                valueStyle={{ color: '#722ed1' }}
              />
              <div className="statistics-growth statistics-growth-purple">
                <ArrowUpOutlined /> 3.2% geçen aya göre
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} className="mb-6 sm:mb-0">
            <Card className="statistics-card h-full">
              <Statistic
                title="İade Oranı"
                value={2.4}
                suffix="%"
                valueStyle={{ color: '#cf1322' }}
              />
              <div className="statistics-growth statistics-growth-red">
                <ArrowDownOutlined /> 0.5% geçen aya göre
              </div>
            </Card>
          </Col>
        </Row>

        {/* Grafikler */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} lg={16} className="mb-8 lg:mb-0">
            <Card className="statistics-page-card h-full">
              <h2 className="statistics-page-card-title">Aylık Satışlar</h2>
              <div className="statistics-page-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₺${value}`, 'Satış']} />
                    <Legend />
                    <Bar dataKey="value" name="Satış" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8} className="mb-8 lg:mb-0">
            <Card className="statistics-page-card h-full">
              <h2 className="statistics-page-card-title">Kategori Dağılımı</h2>
              <div className="statistics-page-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₺${value}`, 'Satış']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Satış Detayları Tablosu */}
        <Card className="statistics-page-card">
          <h2 className="statistics-page-card-title">Satış Detayları</h2>
          <div className="statistics-table-container">
            <Table
              className="statistics-table"
              columns={columns}
              dataSource={salesData}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPage; 