import { useState } from 'react';
import Categories from '../../components/Categories';
import Products from '../../components/Products';
import CartTotals from '../../components/CartTotals';
import Header from '../../components/Header';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        <div className="categories-wrapper min-w-[200px] max-w-[200px] bg-white rounded-lg shadow-sm">
          <Categories onCategorySelect={setSelectedCategory} />
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm">
          <Products selectedCategory={selectedCategory} />
        </div>
        <div className="cart-wrapper min-w-[300px] max-w-[300px]">
          <CartTotals />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 