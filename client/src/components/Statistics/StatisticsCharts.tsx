import React from 'react';
import { Card, Row, Col } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

// Sample data - In a real application, this would come from your API
const salesData = [
  { name: 'Ocak', sales: 4000, orders: 2400 },
  { name: 'Şubat', sales: 3000, orders: 1398 },
  { name: 'Mart', sales: 2000, orders: 9800 },
  { name: 'Nisan', sales: 2780, orders: 3908 },
  { name: 'Mayıs', sales: 1890, orders: 4800 },
  { name: 'Haziran', sales: 2390, orders: 3800 },
];

const customerData = [
  { name: 'Ocak', customers: 100 },
  { name: 'Şubat', customers: 150 },
  { name: 'Mart', customers: 200 },
  { name: 'Nisan', customers: 250 },
  { name: 'Mayıs', customers: 300 },
  { name: 'Haziran', customers: 350 },
];

const StatisticsCharts: React.FC = () => {
  return (
    <Row gutter={[24, 24]} className="mt-6">
      <Col xs={24} lg={12}>
        <Card title="Satış ve Sipariş İstatistikleri" className="shadow-sm">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Satışlar" />
              <Bar dataKey="orders" fill="#82ca9d" name="Siparişler" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Müşteri Büyümesi" className="shadow-sm">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={customerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="#8884d8"
                name="Müşteriler"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticsCharts; 