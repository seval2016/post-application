import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ClearOutlined } from '@ant-design/icons';
import { clearCart } from '../../redux/cartSlice';
import { useState } from 'react';
import OrderModal from '../../common/OrderModal';
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
      <Button 
        type="primary" 
        block 
        size="large" 
        className="bg-blue-600 h-12 mt-4"
        onClick={handleOrderClick}
        disabled={items.length === 0}
      >
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