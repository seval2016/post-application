import React, { useState } from 'react';
import '../../styles/Cart/CartTotals.css';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/cartSlice';
import OrderModal from '../../common/modals/OrderModal';
import { RootState } from '../../redux/store';
import { ClearOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface CartSummaryProps {
  total: number;
  discount?: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ total, discount = 0 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);

  const handleOrderClick = () => {
    if (items.length === 0) {
      return;
    }
    setOrderModalVisible(true);
  };

  const handleOrderSuccess = () => {
    setOrderModalVisible(false);
    dispatch(clearCart());
    navigate('/orders');
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
        isVisible={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        onSuccess={handleOrderSuccess}
        orderId={`ORD-${Date.now()}`}
        customerInfo={{
          name: "",
          email: "",
          phone: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
          }
        }}
        items={items.map(item => ({
          name: item.title,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        }))}
        subtotal={total}
        tax={total * 0.08}
        shippingCost={15}
        total={total + (total * 0.08) + 15 - discount}
      />
    </div>
  );
};

export default CartSummary; 