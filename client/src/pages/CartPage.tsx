import { useSelector } from 'react-redux';
import { selectCartItemsCount } from '../redux/cartSlice';


// ... diğer importlar

const CartPage = () => {
  const cartItemsCount = useSelector(selectCartItemsCount);

  return (
    <div className="cart-page">
      <div className="cart-content">
        <div className="cart-totals">
          <div className="cart-totals-header">
            <h2 className="cart-totals-title">Sepetim</h2>
            <span className="cart-totals-count">{cartItemsCount} ürün</span>
          </div>
          {/* ... diğer cart içeriği ... */}
        </div>
      </div>
    </div>
  );
};

export default CartPage; 