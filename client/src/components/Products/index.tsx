import { useState, useEffect } from 'react';
import { Button, message, Modal, Form, Input, InputNumber, Upload, Select } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { getProducts, deleteProduct, Product, updateProduct } from '../../services/product';
import { categoryService } from '../../services/categoryService';
import AddProductModal from './AddProductModal';
import ProductCard from './ProductCard';
import '../../styles/Products/Products.css';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory] = useState<string | undefined>(undefined);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [form] = Form.useForm();
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; }[]>([]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error: unknown) {
      console.error('Kategoriler yüklenirken hata:', error);
      message.error('Kategoriler yüklenirken bir hata oluştu');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      console.error('Ürün silinirken hata:', error);
      message.error('Ürün silinirken bir hata oluştu');
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
      const formValues = await form.validateFields();
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, formValues);
        message.success('Ürün başarıyla güncellendi');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error: unknown) {
      console.error('Ürün güncellenirken hata:', error);
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
      
      if (!response.ok) {
        throw new Error('Resim yüklenirken bir hata oluştu');
      }
      
      const data = await response.json();
      setImageUrl(data.url);
      form.setFieldsValue({ image: data.url });
    } catch (error: unknown) {
      console.error('Resim yüklenirken hata:', error);
      message.error('Resim yüklenirken bir hata oluştu');
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.categoryId === selectedCategory)
    : products;

  return (
    <div className="products">
      <div className="products-header">
        <h2 className="products-title">Ürünler</h2>
        <div className="flex items-center gap-4">
          <span className="products-count">{filteredProducts.length} Ürün</span>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddModalVisible(true)}
          >
            Yeni Ürün
          </Button>
        </div>
      </div>
      <div className="products-list">
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
          onFinish={handleModalOk}
        >
          <Form.Item
            name="categoryId"
            label="Kategori"
            rules={[{ required: true, message: 'Lütfen kategori seçin!' }]}
          >
            <Select
              className="w-full"
              placeholder="Kategori seçin"
              loading={loadingCategories}
              optionFilterProp="children"
              showSearch
            >
              {categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

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
              <Upload
                beforeUpload={(file) => {
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
                }}
                showUploadList={false}
              >
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