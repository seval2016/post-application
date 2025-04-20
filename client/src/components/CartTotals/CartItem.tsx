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
    <div className="cart-item flex items-center gap-2 bg-gray-50 p-2 rounded-lg mb-2">
      <img 
        src={image} 
        alt={title} 
        className="w-12 h-12 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="text-gray-700 text-sm font-medium truncate">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-green-600 text-sm font-semibold">
            ₺{(price * quantity).toFixed(2)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="text"
              size="small"
              icon={<MinusCircleOutlined className="text-xs" />}
              onClick={() => dispatch(updateQuantity({ id, type: 'decrease' }))}
              className="p-0 h-auto"
            />
            <span className="w-6 text-center text-xs">{quantity}</span>
            <Button
              type="text"
              size="small"
              icon={<PlusCircleOutlined className="text-xs" />}
              onClick={() => dispatch(updateQuantity({ id, type: 'increase' }))}
              className="p-0 h-auto"
            />
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined className="text-xs" />}
              onClick={() => dispatch(removeFromCart(id))}
              className="p-0 h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 