import { useState } from 'react';
import Categories from '../../components/Categories';
import Products from '../../components/Products';
import CartTotals from '../../components/CartTotals';
import Header from '../../components/Header';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row flex-1 p-4 md:p-6 gap-4 md:gap-6">
        <div className="categories-wrapper w-full md:min-w-[200px] md:max-w-[200px] bg-white rounded-lg shadow-sm order-1 md:order-1">
          <Categories onCategorySelect={setSelectedCategory} />
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm order-2 md:order-2">
          <Products selectedCategory={selectedCategory} />
        </div>
        <div className="cart-wrapper w-full md:min-w-[350px] md:max-w-[350px] order-3 md:order-3">
          <CartTotals />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 