import { useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Categories from '../../components/Categories';
import Products from '../../components/Products';
import CartTotals from '../../components/CartTotals';
import Header from '../../components/Header';
import { RootState } from '../../redux/store';
import { updateQuantity, removeFromCart } from '../../redux/cartSlice';

interface Category {
  id: string;
  name: string;
  image: string;
}

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { items, total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleQuantityChange = (id: number, quantity: number) => {
    const type = quantity > 1 ? 'increase' : 'decrease';
    dispatch(updateQuantity({ id, type }));
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleCategoriesLoaded = (loadedCategories: Category[]) => {
    setCategories(loadedCategories);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-col md:flex-row flex-1 p-2 md:p-4 gap-2 md:gap-4 mt-14 md:mt-16 overflow-hidden">
        <div className="categories-wrapper w-full md:min-w-[200px] md:max-w-[200px] bg-white rounded-lg shadow-sm order-1 md:order-1 overflow-y-auto">
          <Categories onCategorySelect={setSelectedCategory} onCategoriesLoaded={handleCategoriesLoaded} />
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm order-2 md:order-2 overflow-y-auto">
          <Products selectedCategory={selectedCategory} categories={categories} />
        </div>
        <div className="cart-wrapper w-full md:min-w-[350px] md:max-w-[350px] order-3 md:order-3 h-full overflow-y-auto">
          <CartTotals 
            items={items}
            total={total}
            discount={0}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 