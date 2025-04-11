import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const CartTotals = () => {
  const { items, total } = useSelector((state: RootState) => state.cart);

  // KDV oranı %8 olarak hesaplanıyor
  const VAT_RATE = 0.08;
  const subtotal = total;
  const vat = subtotal * VAT_RATE;
  const grandTotal = subtotal + vat;

  return (
    <div className="cart bg-white px-4 py-6 rounded-lg shadow-sm h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <h2 className="text-base font-medium text-gray-700">Sepetim</h2>
        <span className="text-xs text-gray-500">{items.length} ürün</span>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
        {items.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
      </div>

      <CartSummary 
        subtotal={subtotal}
        vat={vat}
        total={grandTotal}
      />
    </div>
  );
};

export default CartTotals; 