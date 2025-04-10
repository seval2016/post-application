import { useState } from 'react';
import Categories from '../Categories';
import Products from '../Products';
import CartTotals from '../CartTotals';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="home p-6 flex flex-col md:flex-row gap-6">
      <div className="categories-wrapper flex flex-row md:flex-col overflow-x-auto md:overflow-x-hidden md:min-w-[200px] md:max-w-[200px]">
        <Categories onCategorySelect={setSelectedCategory} />
      </div>
      <div className="products-wrapper flex-1 mt-6 md:mt-0">
        <Products selectedCategory={selectedCategory} />
      </div>
      <div className="cart-wrapper min-w-[300px] md:min-w-[300px] mt-6 md:mt-0">
        <CartTotals />
      </div>
    </div>
  );
};

export default Home; 