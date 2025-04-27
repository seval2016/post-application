import React from 'react';
import { Layout } from 'antd';
import Header from '../../components/Header';
import CartItems from '../../components/Cart/CartItems';
import OrderSummary from '../../components/Cart/OrderSummary';
import '../../styles/CartPage/CartPage.css';

const { Content } = Layout;

const CartPage: React.FC = () => {
  return (
    <Layout className="cart-page">
      <Header />
      <Content className="cart-content">
        <div className="cart-container">
          <CartItems />            
          <OrderSummary />
      </div>
      </Content>
    </Layout>
  );
};

export default CartPage; 