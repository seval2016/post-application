import React from 'react';
import { Link } from 'react-router-dom';
import { ShopOutlined } from '@ant-design/icons';
import '../../styles/Header/Logo.css';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="logo-link">
      <ShopOutlined className="logo" />
      <span className="logo-text">LOGO</span>
    </Link>
  );
};

export default Logo; 