import React, { useState } from 'react';
import '../../styles/Cart/CartTotals.css';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/cartSlice';
import OrderModal from '../../common/modals/OrderModal/index';
import { RootState } from '../../redux/store';
import { ClearOutlined } from '@ant-design/icons';

interface CartSummaryProps {
  total: number;
  discount?: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ total, discount = 0 }) => {
  const dispatch = useDispatch();
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);

  const handleOrderClick = () => {
    if (items.length === 0) {
      return;
    }
    setOrderModalVisible(true);
  };

  return (
    <div className="cart-totals-summary">
      <div className="cart-totals-row">
        <span>Ara Toplam</span>
        <span>₺{total.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="cart-totals-discount">
          <span>İndirim</span>
          <span>-₺{discount.toFixed(2)}</span>
        </div>
      )}
      <div className="cart-totals-total">
        <span>Toplam</span>
        <span className="cart-totals-amount">₺{(total - discount).toFixed(2)}</span>
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
        open={orderModalVisible}
        onClose={() => setOrderModalVisible(false)}
        values={{
          items: items.map(item => ({
            id: item.productId,
            name: item.title,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
          })),
          subtotal: total,
          vat: total * 0.18,
          total: total * 1.18
        }}
      />
    </div>
  );
};

export default CartSummary;