import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { ClearOutlined } from '@ant-design/icons';
import { clearCart } from '../../redux/cartSlice';

interface CartSummaryProps {
  subtotal: number;
  vat: number;
  total: number;
}

const CartSummary = ({ subtotal, vat, total }: CartSummaryProps) => {
  const dispatch = useDispatch();

  return (
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
        <span className="text-green-600">₺{total.toFixed(2)}</span>
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
  );
};

export default CartSummary; 