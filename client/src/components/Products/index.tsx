import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addToCart } from '../../redux/cartSlice';
import { getProducts } from '../../services/product';
import AddProductModal from './AddProductModal';

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  image: string;
}

interface ProductsProps {
  selectedCategory?: string;
}

const Products: React.FC<ProductsProps> = ({ selectedCategory }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const dispatch = useDispatch();

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      message.error('Ürünler yüklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.image
    }));
    message.success('Ürün sepete eklendi');
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="p-6">
      <div className="categories-header">
        <h2 className="categories-title">Ürünler</h2>
        <div className="flex items-center gap-4">
          <span className="categories-count">{filteredProducts.length}</span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
          >
            Yeni Ürün
          </Button>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1">
              <div className="relative pt-[100%] bg-gray-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <h3 className="px-4 py-3 text-sm font-medium text-gray-800 line-clamp-2">
                {product.title}
              </h3>
              <div className="flex justify-between items-center px-3 py-2 border-t border-gray-100">
                <span className="text-base font-medium text-blue-500">
                  ₺{product.price.toFixed(2)}
                </span>
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined className="text-sm" />}
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center justify-center w-7 h-7 !p-0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddProductModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSuccess={() => {
          setAddModalVisible(false);
          fetchProducts();
        }}
      />
    </div>
  );
};

export default Products; 