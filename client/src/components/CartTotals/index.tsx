import { Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  DeleteOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/cartSlice';
import { RootState } from '../../redux/store';

const CartTotals = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  // KDV oranı %8 olarak hesaplanıyor
  const VAT_RATE = 0.08;
  const subtotal = total;
  const vat = subtotal * VAT_RATE;
  const grandTotal = subtotal + vat;

  return (
    <div className="cart bg-white px-4 py-6 rounded-lg shadow-sm h-[calc(100vh-100px)] flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Sepetim</h2>
      
      <div className="flex-1 overflow-y-auto pr-2 cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item flex items-center gap-2 bg-gray-50 p-3 rounded-lg mb-3">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-gray-700 font-medium">{item.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-green-600 font-semibold">
                  ₺{(item.price * item.quantity).toFixed(2)}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="text"
                    size="small"
                    icon={<MinusCircleOutlined />}
                    onClick={() => dispatch(updateQuantity({ id: item.id, type: 'decrease' }))}
                  />
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    type="text"
                    size="small"
                    icon={<PlusCircleOutlined />}
                    onClick={() => dispatch(updateQuantity({ id: item.id, type: 'increase' }))}
                  />
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => dispatch(removeFromCart(item.id))}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-4 space-y-2">
        <div className="flex justify-between items-center text-gray-600">
          <span>Ara Toplam</span>
          <span>₺{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-red-500">
          <span>KDV (%8)</span>
          <span>₺{vat.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-semibold mt-2 pt-2 border-t">
          <span>Toplam</span>
          <span className="text-green-600">₺{grandTotal.toFixed(2)}</span>
        </div>
        <Button type="primary" block size="large" className="bg-blue-600 h-12 mt-4">
          Sipariş Oluştur
        </Button>
        <Button 
          type="primary" 
          danger 
          block 
          size="large" 
          icon={<ClearOutlined />}
          className="h-12"
          onClick={() => dispatch(clearCart())}
        >
          Sepeti Temizle
        </Button>
      </div>

      <style>
        {`
          .cart-items::-webkit-scrollbar {
            width: 6px;
          }
          .cart-items::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          .cart-items::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 3px;
          }
          .cart-items::-webkit-scrollbar-thumb:hover {
            background: #ccc;
          }
        `}
      </style>
    </div>
  );
};

export default CartTotals; 