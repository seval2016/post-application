import { useState, useEffect } from 'react';
import { Button, message, Modal, Form, Input, InputNumber, Upload } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { getProducts, deleteProduct, Product, updateProduct } from '../../services/product';
import AddProductModal from './AddProductModal';
import ProductCard from './ProductCard';

interface ProductsProps {
  selectedCategory?: string;
}

const Products: React.FC<ProductsProps> = ({ selectedCategory }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      console.log('Gelen ürünler:', data);
      setProducts(data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      message.error('Ürünler yüklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      console.log('Silinecek ürün ID:', id);
      await deleteProduct(id);
      await fetchProducts(); // Ürünleri yeniden yükle
      message.success('Ürün başarıyla silindi');
    } catch (error) {
      console.error('Silme hatası:', error);
      message.error('Ürün silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setImageUrl(product.image);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct?._id) {
        const updatedValues = {
          ...values,
          image: imageUrl || editingProduct.image
        };
        await updateProduct(editingProduct._id, updatedValues);
        await fetchProducts();
        setImageUrl('');
        message.success('Ürün başarıyla güncellendi');
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      message.error('Ürün güncellenirken bir hata oluştu');
    }
  };

  const handleModalCancel = () => {
    setImageUrl('');
    setIsModalVisible(false);
  };

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.url) {
        setImageUrl(data.url);
        form.setFieldValue('image', data.url);
        message.success('Görsel başarıyla yüklendi');
      }
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      message.error('Görsel yüklenirken bir hata oluştu');
    }
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Sadece resim dosyaları yükleyebilirsiniz!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Resim 2MB\'dan küçük olmalıdır!');
        return false;
      }
      handleUpload(file);
      return false;
    },
    showUploadList: false
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
          {filteredProducts.map((item) => (
            <div key={`product-${item._id}`}>
              <ProductCard 
                item={item} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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

      <Modal
        title="Ürün Düzenle"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Güncelle"
        cancelText="İptal"
        width={500}
      >
        <Form 
          form={form} 
          layout="vertical"
          className="max-w-full"
        >
          <Form.Item
            name="title"
            label="Ürün Adı"
            rules={[{ required: true, message: 'Lütfen ürün adını girin!' }]}
          >
            <Input id="product-title" className="w-full" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Ürün Görseli"
            rules={[{ required: true, message: 'Lütfen ürün görseli yükleyin!' }]}
          >
            <div className="flex flex-col gap-4">
              {(imageUrl || editingProduct?.image) && (
                <div className="w-full h-48 relative">
                  <img 
                    src={imageUrl || editingProduct?.image}
                    alt="product" 
                    className="w-full h-full object-contain border rounded p-2" 
                  />
                </div>
              )}
              <Upload {...uploadProps} id="product-image">
                <Button icon={<UploadOutlined />} className="w-full">
                  {imageUrl || editingProduct?.image ? 'Görseli Değiştir' : 'Görsel Yükle'}
                </Button>
              </Upload>
            </div>
          </Form.Item>
          <Form.Item
            name="price"
            label="Fiyat"
            rules={[{ required: true, message: 'Lütfen fiyat girin!' }]}
          >
            <InputNumber 
              className="w-full"
              min={0}
              precision={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              stringMode
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products; 