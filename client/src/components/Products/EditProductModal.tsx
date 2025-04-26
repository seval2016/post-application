import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message, Upload, Button, Divider } from 'antd';
import { UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { Product, updateProduct } from '../../services/product';
import { getCategories, Category } from '../../services/category';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

interface EditProductModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  product,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
        message.error('Kategoriler yüklenirken bir hata oluştu');
      } finally {
        setLoadingCategories(false);
      }
    };

    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  useEffect(() => {
    if (visible && product) {
      form.setFieldsValue({
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
      });
      setImageUrl(product.image);
    } else {
      form.resetFields();
      setFileList([]);
      setImageUrl('');
    }
  }, [visible, product, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!imageUrl) {
        message.error('Lütfen bir ürün görseli yükleyin');
        return;
      }

      setUploading(true);
      
      try {
        let finalImageUrl = imageUrl;
        
        if (fileList.length > 0) {
          const formData = new FormData();
          formData.append('file', fileList[0].originFileObj as Blob);
          
          const uploadResponse = await fetch('http://localhost:5000/api/upload/single', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Dosya yükleme hatası');
          }
          
          const uploadResult = await uploadResponse.json();
          finalImageUrl = `http://localhost:5000${uploadResult.path}`;
        }
        
        if (product) {
          const productData = {
            ...values,
            image: finalImageUrl
          };
          
          await updateProduct(product._id, productData);
          message.success('Ürün başarıyla güncellendi');
          form.resetFields();
          setFileList([]);
          setImageUrl('');
          onSuccess();
          onClose();
        }
      } catch (error) {
        console.error('Ürün güncellenirken hata:', error);
        message.error(`Ürün güncellenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      } finally {
        setUploading(false);
      }
    } catch (error) {
      console.error('Form validasyon hatası:', error);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Sadece resim dosyaları yükleyebilirsiniz!');
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Resim 5MB\'dan küçük olmalıdır!');
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      return false;
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onRemove: () => {
      setFileList([]);
      setImageUrl(product?.image || '');
    },
  };

  const handleAddCategory = async (name: string) => {
    try {
      const newCategoryData = {
        name,
      };
      
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategoryData),
      });
      
      if (!response.ok) {
        throw new Error('Kategori eklenirken hata');
      }
      
      const data = await response.json();
      setCategories([...categories, data]);
      form.setFieldValue('category', data.id);
      setNewCategory('');
    } catch (error) {
      console.error('Yeni kategori eklenirken hata:', error);
      message.error('Yeni kategori eklenirken bir hata oluştu');
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={800}
      centered
      footer={null}
      closable={false}
      className="edit-product-modal"
      bodyStyle={{ 
        padding: 0,
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #f3f4f6',
          backgroundColor: '#ffffff'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: '600',
            color: '#111827'
          }}>
            Ürün Düzenle
          </h2>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderRadius: '8px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '24px', flex: 1 }}>
          <Form 
            form={form} 
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '24px',
            }}
          >
            {/* Image Upload Section */}
            <div style={{ marginBottom: '24px' }}>
              <Form.Item
                name="image"
                label={<span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Ürün Görseli</span>}
                rules={[{ required: true, message: 'Lütfen ürün görseli yükleyin' }]}
              >
                <Upload.Dragger 
                  {...uploadProps}
                  style={{
                    border: '2px dashed #e5e7eb',
                    borderRadius: '12px',
                    background: '#ffffff',
                    transition: 'all 0.3s',
                  }}
                  height={240}
                >
                  {imageUrl ? (
                    <div style={{ padding: '16px' }}>
                      <img
                        src={imageUrl}
                        alt="product"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '180px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                        }}
                      />
                      <div style={{
                        marginTop: '12px',
                        fontSize: '13px',
                        color: '#6b7280',
                      }}>
                        Değiştirmek için tıklayın veya yeni bir görsel sürükleyin
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '32px 16px' }}>
                      <p className="ant-upload-drag-icon" style={{ marginBottom: '16px' }}>
                        <UploadOutlined style={{ fontSize: '32px', color: '#60a5fa' }} />
                      </p>
                      <p style={{ 
                        fontSize: '16px', 
                        fontWeight: '500',
                        color: '#111827',
                        marginBottom: '8px'
                      }}>
                        Görsel Yükle
                      </p>
                      <p style={{ 
                        fontSize: '14px',
                        color: '#6b7280',
                        marginBottom: '16px'
                      }}>
                        Görsel yüklemek için tıklayın veya sürükleyin
                      </p>
                      <span style={{ 
                        fontSize: '12px',
                        color: '#6b7280',
                        background: '#f3f4f6',
                        padding: '6px 12px',
                        borderRadius: '16px',
                      }}>
                        PNG, JPG, JPEG (max: 5MB)
                      </span>
                    </div>
                  )}
                </Upload.Dragger>
              </Form.Item>
            </div>

            {/* Form Fields */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <Form.Item
                name="title"
                label={<span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Ürün Adı</span>}
                rules={[{ required: true, message: 'Lütfen ürün adını girin' }]}
              >
                <Input 
                  size="large"
                  placeholder="Ürün adını girin"
                  style={{ 
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '14px',
                  }}
                />
              </Form.Item>

              <Form.Item
                name="price"
                label={<span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Fiyat</span>}
                rules={[{ required: true, message: 'Lütfen fiyatı girin' }]}
              >
                <InputNumber
                  size="large"
                  placeholder="0.00"
                  min={0}
                  style={{ 
                    width: '100%',
                    borderRadius: '8px',
                    height: '44px',
                    fontSize: '14px',
                  }}
                  prefix="₺"
                  addonAfter="TL"
                />
              </Form.Item>

              <Form.Item
                name="category"
                label={<span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Kategori</span>}
                rules={[{ required: true, message: 'Lütfen kategori seçin' }]}
              >
                <Select
                  size="large"
                  placeholder="Kategori seçin veya yeni kategori ekleyin"
                  loading={loadingCategories}
                  style={{ 
                    width: '100%',
                    borderRadius: '8px',
                    height: '44px',
                  }}
                  optionFilterProp="children"
                  showSearch
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <div style={{ padding: '8px' }}>
                        <Input
                          placeholder="Yeni kategori adı"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onPressEnter={() => {
                            if (newCategory.trim()) {
                              handleAddCategory(newCategory.trim());
                            }
                          }}
                          style={{ 
                            borderRadius: '8px',
                            height: '36px',
                            fontSize: '14px',
                          }}
                        />
                      </div>
                    </>
                  )}
                >
                  {categories.map(category => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label={<span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Açıklama</span>}
              >
                <Input.TextArea
                  placeholder="Ürün açıklaması girin"
                  rows={3}
                  maxLength={200}
                  showCount
                  style={{ 
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'none',
                  }}
                />
              </Form.Item>
            </div>
          </Form>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #f3f4f6',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          backgroundColor: '#ffffff'
        }}>
          <Button
            onClick={onClose}
            size="large"
            style={{
              borderRadius: '8px',
              height: '42px',
              padding: '0 20px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            İptal
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={uploading}
            size="large"
            style={{
              borderRadius: '8px',
              height: '42px',
              padding: '0 20px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: '#2563eb',
              borderColor: '#2563eb',
              boxShadow: 'none'
            }}
          >
            {uploading ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProductModal; 