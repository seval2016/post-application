import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectCartItemsCount } from '../../redux/cartSlice';
import CartItem from '../CartItem';
import CartSummary from './CartSummary';
import '../../styles/Cart/CartTotals.css';

interface CartTotalsProps {
  discount?: number;
}

const CartTotals: React.FC<CartTotalsProps> = ({ discount = 0 }) => {
  const { items, total } = useSelector((state: RootState) => state.cart);
  const cartItemsCount = useSelector(selectCartItemsCount);

  // KDV oranı %8 olarak hesaplanıyor
  const VAT_RATE = 0.08;
  const subtotal = total;
  const vat = subtotal * VAT_RATE;
  const grandTotal = subtotal + vat;

  return (
    <div className="cart-totals-container">
      <div className="cart-totals-header">
        <h2 className="cart-totals-title">Sepetim</h2>
        <span className="cart-totals-count">{cartItemsCount} ürün</span>
      </div>

      <div className="cart-totals-items">
        {items.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
          />
        ))}
      </div>

      <div className="cart-totals-summary">
        <CartSummary total={grandTotal} discount={discount} />
      </div>
    </div>
  );
};

export default CartTotals; 