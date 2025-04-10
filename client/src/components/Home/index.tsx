import { useState } from 'react';
import Categories from '../Categories';
import Products from '../Products';
import CartTotals from '../CartTotals';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="home flex gap-6 p-6">
      <div className="categories-wrapper min-w-[220px] max-w-[220px]">
        <Categories onCategorySelect={setSelectedCategory} />
      </div>
      
      <div className="products-wrapper flex-1">
        <Products selectedCategory={selectedCategory} />
      </div>
      
      <div className="cart-totals-wrapper min-w-[300px]">
        <CartTotals />
      </div>
    </div>
  );
};

export default Home; 