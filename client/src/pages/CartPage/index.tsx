import Header from '../../components/Header';
import CartItems from '../../components/Cart/CartItems';
import OrderSummary from '../../components/Cart/OrderSummary';

const CartPage = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full mt-[84px] overflow-y-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <CartItems />
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CartPage; 