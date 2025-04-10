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
      <h2 className="text-lg font-semibold mb-4">Ürünler</h2>
      <div className="products-wrapper overflow-y-auto h-[calc(100%-3rem)] pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-full pt-[56.25%] mb-3">
                <img
                  src={product.image}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-gray-700 font-medium text-base mb-2 h-12 line-clamp-2">{product.title}</h3>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-green-600">
                  ₺{product.price.toFixed(2)}
                </span>
                <Button
                  type="primary"
                  size="middle"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>
        {`
          .products-wrapper::-webkit-scrollbar {
            width: 6px;
          }
          .products-wrapper::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          .products-wrapper::-webkit-scrollbar-thumb {
            background: #ddd;
            border-radius: 3px;
          }
          .products-wrapper::-webkit-scrollbar-thumb:hover {
            background: #ccc;
          }
        `}
      </style>
    </div>
  );
};

export default Products; 