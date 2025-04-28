import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../../redux/cartSlice';
import '../../styles/CartItem/CartItem.css';

interface CartItemProps {
  item: {
    productId: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  const { productId, title, price, image, quantity } = item;

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    dispatch(updateQuantity({ productId, type }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div className="cart-item">
      <img src={image} alt={title} className="cart-item-image" />
      <div className="cart-item-content">
        <h3 className="cart-item-title">{title}</h3>
        <p className="cart-item-price">{price}₺ x {quantity}</p>
        <div className="cart-item-controls">
          <button
            onClick={() => handleQuantityChange('decrease')}
            className="cart-item-quantity-button"
          >
            <MinusOutlined className="cart-item-quantity-icon" />
          </button>
          <span className="cart-item-quantity">{quantity}</span>
          <button
            onClick={() => handleQuantityChange('increase')}
            className="cart-item-quantity-button"
          >
            <PlusOutlined className="cart-item-quantity-icon" />
          </button>
          <button
            onClick={handleRemove}
            className="cart-item-delete"
          >
            <DeleteOutlined className="cart-item-delete-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 