import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../../redux/cartSlice';
import '../../styles/CartItem/CartItem.css';

interface CartItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ id, title, price, image, quantity }) => {
  const dispatch = useDispatch();

  return (
    <div className="cart-item">
      <img src={image} alt={title} className="cart-item-image" />
      <div className="cart-item-content">
        <h3 className="cart-item-title">{title}</h3>
        <p className="cart-item-price">{price}₺ x {quantity}</p>
        <div className="cart-item-controls">
          <button
            onClick={() => dispatch(decreaseQuantity(id))}
            className="cart-item-quantity-button"
          >
            <MinusOutlined className="cart-item-quantity-icon" />
          </button>
          <span className="cart-item-quantity">{quantity}</span>
          <button
            onClick={() => dispatch(increaseQuantity(id))}
            className="cart-item-quantity-button"
          >
            <PlusOutlined className="cart-item-quantity-icon" />
          </button>
          <button
            onClick={() => dispatch(removeFromCart(id))}
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