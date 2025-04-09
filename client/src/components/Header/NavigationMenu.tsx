import React from 'react';
import { 
  HomeOutlined, 
  ShoppingCartOutlined, 
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import { Badge } from 'antd';

export const CartIcon = () => (
  <a href="/cart" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group sm:hidden">
    <Badge count={1} size="small">
      <ShoppingCartOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
    </Badge>
  </a>
);

const DesktopMenu = () => (
  <nav className="hidden sm:flex items-center gap-8">
    <a href="/home" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
      <HomeOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
      <span className="text-xs">Ana Sayfa</span>
    </a>
    <a href="/cart" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
      <Badge count={1} size="small">
        <ShoppingCartOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
      </Badge>
      <span className="text-xs">Sepet</span>
    </a>
    <a href="/bills" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
      <FileTextOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
      <span className="text-xs">Faturalar</span>
    </a>
    <a href="/customers" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
      <UserOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
      <span className="text-xs">Müşteriler</span>
    </a>
    <a href="/statistics" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
      <BarChartOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
      <span className="text-xs">İstatistikler</span>
    </a>
    <a href="/logout" className="hover:text-red-500 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
      <LogoutOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
      <span className="text-xs">Çıkış</span>
    </a>
  </nav>
);

const MobileMenu = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 sm:hidden">
    <div className="flex items-center justify-around">
      <a href="/home" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
        <HomeOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
        <span className="text-xs">Ana Sayfa</span>
      </a>
      <a href="/bills" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
        <FileTextOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
        <span className="text-xs">Faturalar</span>
      </a>
      <a href="/customers" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
        <UserOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
        <span className="text-xs">Müşteriler</span>
      </a>
      <a href="/statistics" className="hover:text-blue-600 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
        <BarChartOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
        <span className="text-xs">İstatistikler</span>
      </a>
      <a href="/logout" className="hover:text-red-500 transition-all duration-300 ease-in-out flex flex-col items-center gap-1 group">
        <LogoutOutlined className="text-lg transition-all duration-300 group-hover:scale-110" />
        <span className="text-xs">Çıkış</span>
      </a>
    </div>
  </nav>
);

const NavigationMenu = () => {
  return (
    <>
      <DesktopMenu />
      <MobileMenu />
    </>
  );
};

export default NavigationMenu; 