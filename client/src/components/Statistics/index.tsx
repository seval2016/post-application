import { DatePicker } from 'antd';
import StatisticsCards from './StatisticsCards';
import StatisticsCharts from './StatisticsCharts';
import '../../styles/Statistics/Statistics.css';

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

const Statistics = () => {
  return (
    <div className="statistics-container">
      <div className="statistics-header">
        <RangePicker className="statistics-date-picker" />
      </div>
      <div className="statistics-content">
        <StatisticsCards data={statisticsData} />
        <div className="charts-container">
          <h3 className="charts-title">Satış ve Müşteri İstatistikleri</h3>
          <StatisticsCharts />
        </div>
      </div>
    </div>
  );
};

export default Statistics; 