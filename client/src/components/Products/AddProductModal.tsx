import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message, Upload, Button, Divider, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { addProduct } from '../../services/product';
import { getCategories, Category } from '../../services/category';
import type { UploadProps } from 'antd/es/upload/interface';

interface AddProductModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Kategorileri yükle
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

  // Modal kapandığında formu sıfırla
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setImageUrl('');
    }
  }, [visible, form]);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Resim yükleme başarısız');
      }

      const data = await response.json();
      setImageUrl(data.url);
      form.setFieldValue('image', data.url);
      message.success('Görsel başarıyla yüklendi');
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      message.error('Görsel yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
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
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!imageUrl) {
        message.error('Lütfen bir ürün görseli yükleyin');
        return;
      }

      await addProduct({
        ...values,
        image: imageUrl
      });

      message.success('Ürün başarıyla eklendi');
      form.resetFields();
      setImageUrl('');
      onSuccess();
    } catch (error) {
      console.error('Ürün ekleme hatası:', error);
      message.error('Ürün eklenirken bir hata oluştu');
    }
  };

  // İptal işlemi
  const handleCancel = () => {
    form.resetFields();
    setImageUrl('');
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  return (
    <Modal
      title={<div style={{ fontSize: '18px', fontWeight: 'bold' }}>Yeni Ürün Ekle</div>}
      open={visible}
      onCancel={handleCancel}
      width={600}
      centered
      destroyOnClose
      footer={null}
      maskClosable={false}
      closable={true}
    >
      <Form 
        form={form} 
        layout="vertical"
        requiredMark={false}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Ürün Adı"
          rules={[{ required: true, message: 'Lütfen ürün adını girin' }]}
        >
          <Input placeholder="Ürün adını girin" size="large" />
        </Form.Item>
        
        <Form.Item
          name="price"
          label="Fiyat"
          rules={[{ required: true, message: 'Lütfen fiyatı girin' }]}
        >
          <InputNumber 
            min={0} 
            style={{ width: '100%' }} 
            placeholder="Fiyat girin"
            size="large"
            prefix="₺"
            addonAfter="TL"
          />
        </Form.Item>
        
        <Form.Item
          name="category"
          label="Kategori"
          rules={[{ required: true, message: 'Lütfen kategori seçin' }]}
        >
          <Select 
            placeholder="Kategori seçin" 
            size="large"
            optionFilterProp="children"
            showSearch
            loading={loadingCategories}
            notFoundContent={loadingCategories ? <Spin size="small" /> : null}
          >
            {categories.map(category => (
              <Select.Option 
                key={category.id} 
                value={category.id}
              >
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="description"
          label="Açıklama"
        >
          <Input.TextArea 
            placeholder="Ürün açıklaması girin" 
            size="large" 
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>
        
        <Form.Item
          name="image"
          label="Ürün Görseli"
          rules={[{ required: true, message: 'Lütfen ürün görseli yükleyin' }]}
        >
          <div className="flex flex-col gap-4">
            {imageUrl && (
              <div className="w-full h-48 relative">
                <img 
                  src={imageUrl}
                  alt="product" 
                  className="w-full h-full object-contain border rounded p-2" 
                />
              </div>
            )}
            <Upload {...uploadProps} id="add-product-image">
              <Button icon={<UploadOutlined />} className="w-full">
                {imageUrl ? 'Görseli Değiştir' : 'Görsel Yükle'}
              </Button>
            </Upload>
          </div>
        </Form.Item>
        
        <Divider />
        
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            İptal
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={uploading}
          >
            {uploading ? 'Ekleniyor...' : 'Ürün Ekle'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal; 