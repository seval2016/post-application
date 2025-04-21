import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  DollarOutlined, 
  ShoppingOutlined 
} from '@ant-design/icons';

interface StatisticsData {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  salesGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  orderValueGrowth: number;
}

interface StatisticsCardsProps {
  data: StatisticsData;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ data }) => {
  return (
    <Row gutter={[16, 16]}>
      {/* Satış İstatistikleri */}
      <Col xs={24} sm={12} lg={6}>
        <Card className="statistics-card">
          <Statistic
            title="Toplam Satış"
            value={data.totalSales}
            prefix={<DollarOutlined />}
            suffix="₺"
            valueStyle={{ color: '#3f8600' }}
          />
          <div className="statistics-growth statistics-growth-green">
            +{data.salesGrowth}% geçen aya göre
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="statistics-card">
          <Statistic
            title="Toplam Sipariş"
            value={data.totalOrders}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
          <div className="statistics-growth statistics-growth-blue">
            +{data.ordersGrowth}% geçen aya göre
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="statistics-card">
          <Statistic
            title="Toplam Müşteri"
            value={data.totalCustomers}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
          <div className="statistics-growth statistics-growth-purple">
            +{data.customersGrowth}% geçen aya göre
          </div>
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card className="statistics-card">
          <Statistic
            title="Ortalama Sipariş Değeri"
            value={data.averageOrderValue}
            prefix={<ShoppingOutlined />}
            suffix="₺"
            valueStyle={{ color: '#fa8c16' }}
          />
          <div className="statistics-growth statistics-growth-orange">
            +{data.orderValueGrowth}% geçen aya göre
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticsCards; 