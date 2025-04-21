import React from 'react';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import '../../styles/components/Cart/CartTotals.css';

interface CartItemProps {
  item: {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  };
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  if (!item) {
    return null;
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      onQuantityChange(item.id, newQuantity);
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
      <button
        className="cart-item-delete"
        onClick={() => onRemove(item.id)}
      >
        <DeleteOutlined />
      </button>
    </div>
  );
};

export default CartItem; 