import { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import type { FormProps } from 'antd';
import { categoryService, Category } from '../../services/categoryService';
import axios from 'axios';

interface CategoryFormData {
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
      // Boş değerleri kontrol et
      if (!values.name || values.name.trim() === '') {
        message.error('Kategori adı boş olamaz');
        return;
      }
      
      if (!values.image || values.image.trim() === '') {
        message.error('Görsel URL\'si boş olamaz');
        return;
      }
      
      setLoading(true);
      
      // Backend'e gönderilecek veri yapısı
      const categoryData = {
        name: values.name.trim(),
        image: values.image.trim()
      };
      
      console.log('Gönderilen veri:', categoryData);
      
      const newCategory = await categoryService.addCategory(categoryData);
      console.log('Backend yanıtı:', newCategory);
      
      onAdd(newCategory);
      message.success('Kategori başarıyla eklendi');
      form.resetFields();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Backend hatası:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        
        if (error.response?.status === 400) {
          const errorMessage = error.response.data?.message || 'Geçersiz veri formatı. Lütfen tüm alanları doğru şekilde doldurun.';
          message.error(errorMessage);
        } else {
          message.error('Kategori eklenirken bir hata oluştu: ' + error.message);
        }
      } else {
        console.error('Beklenmeyen hata:', error);
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
        name="addCategoryForm"
        key="addCategoryForm"
      >
        <Form.Item
          label="Kategori Adı"
          name="name"
          rules={[
            { required: true, message: 'Lütfen kategori adını girin!' },
            { min: 2, message: 'Kategori adı en az 2 karakter olmalıdır!' }
          ]}
        >
          <Input placeholder="Kategori adını girin" />
        </Form.Item>

        <Form.Item
          label="Görsel URL"
          name="image"
          rules={[
            { required: true, message: 'Lütfen geçerli bir URL girin!' },
            { type: 'url', message: 'Geçerli bir URL girin!' }
          ]}
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