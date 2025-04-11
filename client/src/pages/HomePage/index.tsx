import { useState } from 'react';
import Categories from '../../components/Categories';
import Products from '../../components/Products';
import CartTotals from '../../components/CartTotals';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="home px-6 pb-6 flex gap-6">
      <div className="categories-wrapper min-w-[200px] max-w-[200px]">
        <Categories onCategorySelect={setSelectedCategory} />
      </div>
      <div className="flex-1">
        <Products selectedCategory={selectedCategory} />
      </div>
      <div className="cart-wrapper min-w-[300px] max-w-[300px]">
        <CartTotals />
      </div>
    </div>
  );
};

export default HomePage; 