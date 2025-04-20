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
    <div className="cart bg-white rounded-lg shadow-sm h-auto md:h-[calc(100vh-100px)] md:sticky md:top-[84px] flex flex-col mb-16 sm:mb-0">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h2 className="text-base font-medium text-gray-700">Sepetim</h2>
        <span className="text-xs text-gray-500">{items.length} ürün</span>
      </div>
      
      <div className={`flex-1 p-3 ${items.length > 2 ? 'overflow-y-auto max-h-[200px]' : ''} md:overflow-y-auto md:max-h-[calc(100vh-300px)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full`}>
        {items.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
      </div>

      <div className="p-3">
        <CartSummary 
          subtotal={subtotal}
          vat={vat}
          total={grandTotal}
        />
      </div>
    </div>
  );
};

export default CartTotals; 