import React from 'react';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import '../../styles/Cart/CartTotals.css';
import { CartItem as StoreCartItem } from '../../redux/cartSlice';

interface CartItemProps {
  item: StoreCartItem;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  if (!item) {
    return null;
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      onQuantityChange(Number(item.id), newQuantity);
    }
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.title} className="cart-item-image" />
      <div className="cart-item-content">
        <h3 className="cart-item-title">{item.title}</h3>
        <p className="cart-item-price">{item.price.toFixed(2)} TL</p>
        <div className="cart-item-quantity">
          <button
            className="cart-item-quantity-button"
            onClick={() => handleQuantityChange(item.quantity - 1)}
          >
            <MinusOutlined />
          </button>
          <span className="cart-item-quantity-text">{item.quantity}</span>
          <button
            className="cart-item-quantity-button"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            <PlusOutlined />
          </button>
        </div>
      </div>
      <Popconfirm
        title={`${item.title} ürününü silmek istediğinize emin misiniz?`}
        onConfirm={() => onRemove(item.id)}
        okText="Evet"
        cancelText="Hayır"
        okType="primary"
        okButtonProps={{ className: 'btn-primary' }}
        cancelButtonProps={{ className: 'btn-secondary' }}
        placement="left"
      >
        <button className="cart-item-delete">
          <DeleteOutlined />
        </button>
      </Popconfirm>
    </div>
  );
};

export default CartItem; 