import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { addToCart } from '../../redux/cartSlice';
import productsData from '../../data/products.json';
import '../../styles/components/Products/Products.css';

interface Product {
  id: number;
  title: string;
  price: number;
  category: number;
  image: string;
}

interface ProductsProps {
  selectedCategory: string | null;
}

const Products: React.FC<ProductsProps> = ({ selectedCategory }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const filteredProducts = selectedCategory
      ? productsData.products.filter(product => product.category === Number(selectedCategory))
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
    <div className="products">
      <div className="products-header">
        <h2 className="products-title">Ürünler</h2>
        <span className="products-count">{products.length} ürün</span>
      </div>
      <div className="products-wrapper">
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-image"
                />
              </div>
              <h3 className="product-title">{product.title}</h3>
              <div className="product-footer">
                <span className="product-price">₺{product.price.toFixed(2)}</span>
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined className="add-to-cart-icon" />}
                  onClick={() => handleAddToCart(product)}
                  className="add-to-cart-button"
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