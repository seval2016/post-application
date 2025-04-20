import React from 'react';
import { DatePicker } from 'antd';
import StatisticsCards from './StatisticsCards';
import StatisticsCharts from './StatisticsCharts';

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
    <div className="w-full">
      <div className="flex justify-end items-center mb-4 sm:mb-6">
        <RangePicker className="w-full sm:w-auto" />
      </div>
      <div className="space-y-6 sm:space-y-8">
        <StatisticsCards data={statisticsData} />
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4 sm:mb-6">Satış ve Müşteri İstatistikleri</h3>
          <StatisticsCharts />
        </div>
      </div>
    </div>
  );
};

export default Statistics; 