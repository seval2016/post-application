import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message, Upload, Button, Divider, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { addProduct } from '../../services/product';
import { getCategories, Category } from '../../services/category';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

interface AddProductModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const { Dragger } = Upload;

const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
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
      setFileList([]);
      setImageUrl('');
    }
  }, [visible, form]);

  // Form gönderme işlemi
  const handleSubmit = async () => {
    try {
      // Form validasyonu
      const values = await form.validateFields();
      
      // Resim kontrolü
      if (fileList.length === 0) {
        message.error('Lütfen bir ürün görseli yükleyin');
        return;
      }
      
      setUploading(true);
      
      // Resim yükleme
      const formData = new FormData();
      formData.append('file', fileList[0].originFileObj as Blob);
      
      console.log('Dosya yükleniyor:', fileList[0].originFileObj);
      console.log('FormData içeriği:', Array.from(formData.entries()));
      
      try {
        const uploadResponse = await fetch('http://localhost:5000/api/upload/single', {
          method: 'POST',
          body: formData,
        });
        
        console.log('Upload response status:', uploadResponse.status);
        console.log('Upload response headers:', Object.fromEntries(uploadResponse.headers.entries()));
        
        if (!uploadResponse.ok) {
          let errorMessage = 'İstenen kaynak bulunamadı';
          try {
            const errorData = await uploadResponse.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          console.error('Yükleme hatası:', uploadResponse.status);
          throw new Error(`Dosya yükleme hatası: ${uploadResponse.status} ${errorMessage}`);
        }
        
        const uploadResult = await uploadResponse.json();
        console.log('Yükleme sonucu:', uploadResult);
        
        const imagePath = `http://localhost:5000${uploadResult.path}`;
        
        // Ürün verilerini hazırla
        const productData = {
          ...values,
          image: imagePath
        };
        
        console.log('Ürün verileri:', productData);
        
        // Ürünü ekle
        await addProduct(productData);
        
        message.success('Ürün başarıyla eklendi');
        form.resetFields();
        setFileList([]);
        setImageUrl('');
        onSuccess();
        if (typeof onCancel === 'function') {
          onCancel();
        }
      } catch (error) {
        console.error('Ürün eklenirken hata:', error);
        message.error(`Ürün eklenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      } finally {
        setUploading(false);
      }
    } catch (error) {
      console.error('Form validasyon hatası:', error);
    }
  };

  // İptal işlemi
  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setImageUrl('');
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  // Resim yükleme özellikleri
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      // Dosya tipini kontrol et
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Sadece resim dosyaları yükleyebilirsiniz!');
        return false;
      }

      // Dosya boyutunu kontrol et (5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Resim 5MB\'dan küçük olmalıdır!');
        return false;
      }

      // Dosyayı önizleme için URL oluştur
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
      setImageUrl('');
    },
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
          label="Ürün Görseli"
          required
          tooltip="Ürün için bir görsel yükleyin (max 5MB)"
        >
          {imageUrl ? (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <img 
                src={imageUrl} 
                alt="Ürün görseli" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  objectFit: 'contain',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  padding: '8px'
                }} 
              />
              <Button 
                type="link" 
                danger 
                onClick={() => {
                  setFileList([]);
                  setImageUrl('');
                }}
                style={{ marginTop: '8px' }}
              >
                Görseli Kaldır
              </Button>
            </div>
          ) : (
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Görsel yüklemek için tıklayın veya sürükleyin</p>
              <p className="ant-upload-hint">
                Sadece resim dosyaları (jpg, jpeg, png, gif) ve maksimum 5MB boyutunda
              </p>
            </Dragger>
          )}
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