import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ClearOutlined } from '@ant-design/icons';
import { clearCart } from '../../redux/cartSlice';
import { useState } from 'react';
import OrderModal from '../../common/modals/OrderModal';
import { RootState } from '../../redux/store';

interface CartSummaryProps {
  subtotal: number;
  vat: number;
  total: number;
}

const CartSummary = ({ subtotal, vat, total }: CartSummaryProps) => {
  const dispatch = useDispatch();
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);

  const handleOrderClick = () => {
    if (items.length === 0) {
      // Sepet boşsa kullanıcıya bilgi ver
      return;
    }
    setOrderModalVisible(true);
  };

  const handleOrderSuccess = () => {
    setOrderModalVisible(false);
    dispatch(clearCart());
  };

  return (
    <div className="border-t pt-3 mt-2 space-y-1.5">
      <div className="flex justify-between items-center text-gray-600 text-sm">
        <span>Ara Toplam</span>
        <span>₺{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center text-red-500 text-sm">
        <span>KDV (%8)</span>
        <span>₺{vat.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center text-base font-semibold mt-1.5 pt-1.5 border-t">
        <span>Toplam</span>
        <span className="text-green-600">₺{total.toFixed(2)}</span>
      </div>
      <Button 
        type="primary" 
        block 
        size="middle" 
        className="bg-blue-600 h-10 mt-3"
        onClick={handleOrderClick}
        disabled={items.length === 0}
      >
        Sipariş Oluştur
      </Button>
      <Button 
        type="primary" 
        danger 
        block 
        size="middle" 
        icon={<ClearOutlined />}
        className="h-10"
        onClick={() => dispatch(clearCart())}
        disabled={items.length === 0}
      >
        Sepeti Temizle
      </Button>

      <OrderModal 
        isVisible={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default CartSummary; 