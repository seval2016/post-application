import React from 'react';
import { Typography, Space } from 'antd';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

const { Title } = Typography;

interface PageHeaderProps {
  icon: React.ComponentType<AntdIconProps>;
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
      <Space align="center" size="middle">
        <Icon className="text-2xl text-indigo-500" />
        <div>
          <Title level={4} className="!mb-1 !text-lg">
            {title}
          </Title>
          {subtitle && (
            <span className="text-sm text-gray-500">{subtitle}</span>
          )}
        </div>
      </Space>
    </div>
  );
};

export default PageHeader; 