import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { removeFromCart, updateQuantity } from '../../redux/cartSlice';

interface CartItemProps {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const CartItem = ({ id, title, price, image, quantity }: CartItemProps) => {
  const dispatch = useDispatch();

  return (
    <div className="cart-item flex items-center gap-2 bg-gray-50 p-3 rounded-lg mb-3">
      <img 
        src={image} 
        alt={title} 
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-green-600 font-semibold">
            ₺{(price * quantity).toFixed(2)}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="text"
              size="small"
              icon={<MinusCircleOutlined />}
              onClick={() => dispatch(updateQuantity({ id, type: 'decrease' }))}
            />
            <span className="w-8 text-center">{quantity}</span>
            <Button
              type="text"
              size="small"
              icon={<PlusCircleOutlined />}
              onClick={() => dispatch(updateQuantity({ id, type: 'increase' }))}
            />
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => dispatch(removeFromCart(id))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 