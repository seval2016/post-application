import { Button } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
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

const CartItem = ({ item, onQuantityChange, onRemove }: CartItemProps) => {
  if (!item) {
    return null;
  }

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.title} className="cart-item-image" />
      <div className="cart-item-content">
        <h3 className="cart-item-title">{item.title}</h3>
        <span className="cart-item-price">₺{item.price.toFixed(2)}</span>
      </div>
      <div className="cart-item-quantity">
        <Button
          type="text"
          icon={<MinusCircleOutlined className="cart-item-quantity-button" />}
          onClick={handleDecrease}
        />
        <span className="cart-item-quantity-text">{item.quantity}</span>
        <Button
          type="text"
          icon={<PlusCircleOutlined className="cart-item-quantity-button" />}
          onClick={handleIncrease}
        />
      </div>
      <Button
        type="text"
        icon={<DeleteOutlined className="cart-item-delete" />}
        onClick={() => onRemove(item.id)}
      />
    </div>
  );
};

export default CartItem; 