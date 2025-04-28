import React from 'react';
import { Layout } from 'antd';
import Logo from './Logo';
import Search from './Search';
import NavigationMenu from '../NavigationMenu';
import '../../styles/Header/Header.css';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  return (
    <AntHeader className="header">
      <div className="header-left">
        <Logo />
      </div>
      <div className="header-right">
        <Search />
        <NavigationMenu />
      </div>
    </AntHeader>
  );
};

export default Header; 