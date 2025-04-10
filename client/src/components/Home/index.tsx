import Categories from './Categories';
import Products from './Products';
import CartTotals from './CartTotals';

const Home = () => {
  return (
    <div className="home px-6 flex justify-between gap-10">
      <div className="categories-wrapper min-w-[200px]">
        <Categories />
      </div>
      
      <div className="products-wrapper flex-1">
        <Products />
      </div>
      
      <div className="cart-totals-wrapper min-w-[300px]">
        <CartTotals />
      </div>
    </div>
  );
};

export default Home; 