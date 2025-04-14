import React from 'react';
import { Layout } from 'antd';
import Logo from './Logo';
import Search from './Search';
import NavigationMenu from '../NavigationMenu';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  return (
    <AntHeader className="bg-white px-4 flex items-center justify-between shadow-sm fixed w-full z-10">
      <div className="flex items-center">
        <Logo />
        <Search />
      </div>
      <NavigationMenu />
    </AntHeader>
  );
};

export default Header; 