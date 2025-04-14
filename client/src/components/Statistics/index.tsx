import React from 'react';
import { Typography, DatePicker } from 'antd';
import StatisticsCards from './StatisticsCards';
import StatisticsCharts from './StatisticsCharts';

const { Title } = Typography;
const { RangePicker } = DatePicker;

// Örnek veriler - gerçek uygulamada API'den gelecek
const statisticsData = {
  totalSales: 12500,
  totalOrders: 342,
  totalCustomers: 156,
  averageOrderValue: 36.55,
  salesGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 5.7,
  orderValueGrowth: 3.2
};

const Statistics: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>İstatistikler</Title>
        <RangePicker className="mb-4" />
      </div>

      <StatisticsCards data={statisticsData} />
      <StatisticsCharts />
    </div>
  );
};

export default Statistics; 