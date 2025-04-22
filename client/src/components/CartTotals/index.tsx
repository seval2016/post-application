import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { selectCartItemsCount, removeFromCart, updateQuantity } from '../../redux/cartSlice';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import '../../styles/components/Cart/CartTotals.css';

interface CartTotalsProps {
  discount?: number;
}

const CartTotals: React.FC<CartTotalsProps> = ({ discount = 0 }) => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const cartItemsCount = useSelector(selectCartItemsCount);

  const handleQuantityChange = (id: number, quantity: number) => {
    const currentItem = items.find(item => item.id === id.toString());
    if (currentItem) {
      const type = quantity > currentItem.quantity ? "increase" : "decrease";
      dispatch(updateQuantity({ id: id.toString(), type }));
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

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
            key={item.id}
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
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