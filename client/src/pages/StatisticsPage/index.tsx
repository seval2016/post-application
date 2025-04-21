import { Avatar, Space, Card, Table, Spin } from 'antd';
import { UserOutlined, BarChartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Header from '../../components/Header';
import { RootState } from '../../redux/store';
import PageHeader from '../../common/components/PageHeader';
import '../../styles/pages/StatisticsPage.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatisticsPage = () => {
  const admin = useSelector((state: RootState) => state.auth.user);
  const loading = false;
  const error = null;

  const data = [
    { name: 'Ocak', value: 400 },
    { name: 'Şubat', value: 300 },
    { name: 'Mart', value: 600 },
    { name: 'Nisan', value: 800 },
    { name: 'Mayıs', value: 500 },
    { name: 'Haziran', value: 700 },
  ];

  const columns = [
    {
      title: 'Ay',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Satış',
      dataIndex: 'value',
      key: 'value',
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
        <div className="statistics-page-content">
          <Card className="statistics-page-card">
            <h2 className="statistics-page-card-title">Aylık Satışlar</h2>
            <div className="statistics-page-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="statistics-page-card">
            <h2 className="statistics-page-card-title">Satış Detayları</h2>
            <Table
              className="statistics-page-table"
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage; 