import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '../../redux/cartSlice';

interface CartItemProps {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const CartItem: React.FC<CartItemProps> = ({ id, title, price, image, quantity }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex gap-2 md:gap-4 items-center mb-4 pb-4 border-b border-gray-100 last:mb-0 last:pb-0 last:border-0">
      <img src={image} alt={title} className="w-16 md:w-20 h-16 md:h-20 object-cover rounded-lg" />
      <div className="flex-1">
        <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-2">{price}₺ x {quantity}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(decreaseQuantity(id))}
            className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <MinusOutlined className="text-xs text-gray-600" />
          </button>
          <span className="text-xs md:text-sm font-medium text-gray-700">{quantity}</span>
          <button
            onClick={() => dispatch(increaseQuantity(id))}
            className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <PlusOutlined className="text-xs text-gray-600" />
          </button>
          <button
            onClick={() => dispatch(removeFromCart(id))}
            className="ml-auto w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition-colors"
          >
            <DeleteOutlined className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 