import React from 'react';
import { Layout } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItemsCount } from '../../redux/cartSlice';
import Logo from './Logo';
import Search from './Search';
import NavigationMenu from '../NavigationMenu';
import CustomBadge from '../NavigationMenu/CustomBadge';
import '../../styles/Header/Header.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const cartItemsCount = useSelector(selectCartItemsCount);

  return (
    <AntHeader className="header">
      <div className="header-left">
        <Logo />
        <Search />
      </div>
      <div className="header-right">
        <Link to="/cart" className="cart-icon sm:hidden">
          <CustomBadge count={cartItemsCount}>
            <ShoppingCartOutlined style={{ fontSize: '24px' }} />
          </CustomBadge>
        </Link>
        <NavigationMenu />
      </div>
    </AntHeader>
  );
};

export default Header; 