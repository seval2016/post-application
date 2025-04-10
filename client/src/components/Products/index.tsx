import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addToCart } from '../../redux/cartSlice';
import productsData from '../../data/products.json';

interface Product {
  id: number;
  title: string;
  price: number;
  category: number;
  image: string;
}

interface ProductsProps {
  selectedCategory: number | null;
}

const Products: React.FC<ProductsProps> = ({ selectedCategory }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const filteredProducts = selectedCategory
      ? productsData.products.filter(product => product.category === selectedCategory)
      : productsData.products;
    setProducts(filteredProducts);
  }, [selectedCategory]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    }));
    message.success('Ürün sepete eklendi');
  };

  return (
    <div className="products bg-white px-4 py-6 rounded-lg shadow-sm h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-700">Ürünler</h2>
        <span className="text-sm text-gray-500">{products.length} ürün</span>
      </div>
      <div className="products-wrapper overflow-y-auto h-[calc(100%-4rem)] pr-2 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-md [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb:hover]:bg-gray-400">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card bg-white p-2 md:p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-full pt-[56.25%] mb-2 md:mb-3">
                <img
                  src={product.image}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-gray-700 font-medium text-sm md:text-base mb-2 h-8 md:h-12 line-clamp-2">{product.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg font-semibold text-green-600">₺{product.price.toFixed(2)}</span>
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined className="text-xs md:text-sm" />}
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center w-6 h-6 md:w-8 md:h-8 min-w-[1.5rem] md:min-w-[2rem]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products; 