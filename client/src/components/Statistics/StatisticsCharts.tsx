import { Row, Col } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Scatter
} from 'recharts';

// Örnek veri
const salesData = [
  { month: 'Ocak', value: 4000 },
  { month: 'Şubat', value: 3000 },
  { month: 'Mart', value: 5000 },
  { month: 'Nisan', value: 4500 },
  { month: 'Mayıs', value: 6000 },
  { month: 'Haziran', value: 5500 },
  { month: 'Temmuz', value: 7000 },
  { month: 'Ağustos', value: 6500 },
  { month: 'Eylül', value: 8000 },
  { month: 'Ekim', value: 7500 },
  { month: 'Kasım', value: 9000 },
  { month: 'Aralık', value: 8500 }
];

const customerData = [
  { name: 'Yeni', value: 400 },
  { name: 'Aktif', value: 300 },
  { name: 'Pasif', value: 200 },
  { name: 'VIP', value: 100 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const StatisticsCharts = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <div className="chart-section">
          <h3 className="chart-heading">Aylık Satışlar</h3>
          <ResponsiveContainer width="100%" className="line-chart-container">
            <LineChart 
              data={salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={[0, 'auto']}
              />
              <Tooltip 
                formatter={(value) => [`${value} TL`, 'Satış']}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Satış" 
                stroke="#6366f1" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 8 }}
              />
              <Scatter 
                dataKey="value" 
                name="Satış" 
                fill="#6366f1" 
                stroke="#6366f1" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Col>
      <Col xs={24} lg={8}>
        <div className="chart-section">
          <h3 className="chart-heading">Müşteri Dağılımı</h3>
          <ResponsiveContainer width="100%" className="pie-chart-container">
            <PieChart>
              <Pie
                data={customerData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {customerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Col>
    </Row>
  );
};

export default StatisticsCharts; 