import React from 'react';
import { Layout } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Logo from './Logo';
import Search from './Search';
import NavigationMenu from '../NavigationMenu';
import CustomBadge from '../NavigationMenu/CustomBadge';
import '../../styles/components/Header/Header.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);

  return (
    <AntHeader className="header">
      <div className="header-left">
        <Logo />
        <Search />
      </div>
      <div className="header-right">
        <Link to="/cart" className="cart-icon sm:hidden">
          <CustomBadge count={items.length}>
            <ShoppingCartOutlined style={{ fontSize: '24px' }} />
          </CustomBadge>
        </Link>
        <NavigationMenu cartItems={items} />
      </div>
    </AntHeader>
  );
};

export default Header; 