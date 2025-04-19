import React from 'react';
import { Avatar, Space } from 'antd';
import { UserOutlined, BarChartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import Header from '../../components/Header';
import Statistics from '../../components/Statistics';
import { RootState } from '../../redux/store';
import PageHeader from '../../common/components/PageHeader';

const StatisticsPage = () => {
  const admin = useSelector((state: RootState) => state.auth.user);

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
        <Statistics />
      </div>
    </div>
  );
};

export default StatisticsPage; 