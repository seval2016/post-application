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
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-700">Sepetim</h2>
        <span className="text-sm text-gray-500">{items.length} ürün</span>
      </div>
      
      <div className={`flex-1 p-4 ${items.length > 3 ? 'overflow-y-auto max-h-[300px]' : ''} md:overflow-y-auto md:max-h-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full`}>
        {items.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
      </div>

      <div className="p-4">
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