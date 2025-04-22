import { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import type { FormProps } from 'antd';
import { addCategory } from '../../services/category';

interface CategoryFormData {
  name: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
  image: string;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Category) => void;
}

export const AddCategoryModal = ({ isOpen, onClose, onAdd }: AddCategoryModalProps) => {
  const [form] = Form.useForm<CategoryFormData>();
  const [loading, setLoading] = useState(false);

  // Modal kapandığında formu sıfırla
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  const handleSubmit: FormProps<CategoryFormData>['onFinish'] = async (values) => {
    try {
      console.log('Form değerleri (ham):', values);
      console.log('Form değerleri (stringified):', JSON.stringify(values));
      console.log('Form alanları:', {
        name: values.name,
        nameLength: values.name?.length,
        nameTrimmed: values.name?.trim(),
        image: values.image,
        imageLength: values.image?.length,
        imageTrimmed: values.image?.trim()
      });
      
      // Boş değerleri kontrol et
      if (!values.name || values.name.trim() === '') {
        console.log('Kategori adı validasyon hatası');
        message.error('Kategori adı boş olamaz');
        return;
      }
      
      if (!values.image || values.image.trim() === '') {
        console.log('Görsel URL validasyon hatası');
        message.error('Görsel URL\'si boş olamaz');
        return;
      }
      
      setLoading(true);
      console.log('addCategory fonksiyonuna gönderilen veri:', values);
      const newCategory = await addCategory(values);
      console.log('Eklenen kategori:', newCategory);
      onAdd(newCategory);
      message.success('Kategori başarıyla eklendi');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Kategori ekleme hatası (modal):', error);
      if (error instanceof Error) {
        console.error('Hata detayı:', error.message);
        message.error(error.message);
      } else {
        console.error('Bilinmeyen hata:', error);
        message.error('Kategori eklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Yeni Kategori Ekle"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        preserve={false}
      >
        <Form.Item
          label="Kategori Adı"
          name="name"
          rules={[{ required: true, message: 'Lütfen kategori adını girin!' }]}
        >
          <Input placeholder="Kategori adını girin" />
        </Form.Item>

        <Form.Item
          label="Görsel URL"
          name="image"
          rules={[{ type: 'url', message: 'Lütfen geçerli bir URL girin!' }]}
        >
          <Input placeholder="Görsel URL'sini girin" />
        </Form.Item>

        <Form.Item className="mb-0 text-right">
          <Button 
            onClick={handleCancel} 
            className="mr-2" 
            disabled={loading}
          >
            İptal
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Ekle
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
