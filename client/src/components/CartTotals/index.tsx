import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import '../../styles/components/Cart/CartTotals.css';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartTotalsProps {
  items: CartItem[];
  total: number;
  discount?: number;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

const CartTotals: React.FC<CartTotalsProps> = ({
  discount = 0,
  onQuantityChange,
  onRemoveItem,
}) => {
  const { items, total } = useSelector((state: RootState) => state.cart);

  // KDV oranı %8 olarak hesaplanıyor
  const VAT_RATE = 0.08;
  const subtotal = total;
  const vat = subtotal * VAT_RATE;
  const grandTotal = subtotal + vat;

  return (
    <div className="cart-totals-container">
      <div className="cart-totals-header">
        <h2 className="cart-totals-title">Sepetim</h2>
        <span className="cart-totals-count">{items.length} ürün</span>
      </div>

      <div className="cart-totals-items">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onQuantityChange={onQuantityChange}
            onRemove={onRemoveItem}
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