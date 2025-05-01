import React from 'react';
import Categories from '../../components/Categories';
import Products from '../../components/Products';
import CartTotals from '../../components/CartTotals';
import Header from '../../components/Header';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen md:overflow-hidden">
      <Header />
      <div className="flex flex-col md:flex-row flex-1 p-2 md:p-4 gap-2 md:gap-4 mt-14 md:mt-16 md:overflow-hidden">
        <div className="categories-wrapper w-full md:w-[280px] bg-white rounded-lg shadow-sm order-1 overflow-auto">
          <Categories />
        </div>
        <div className="products-wrapper flex-1 bg-white rounded-lg shadow-sm order-2 overflow-auto">
          <Products />
        </div>
        <div className="cart-wrapper w-full md:w-[350px] bg-white rounded-lg shadow-sm order-3 overflow-auto">
          <CartTotals discount={0} />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 