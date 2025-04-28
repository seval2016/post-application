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
      const newCategory = await addCategory(values);
      onAdd(newCategory);
      message.success('Kategori başarıyla eklendi');
      form.resetFields();
      onClose();
    } catch {
      message.error('Kategori eklenirken bir hata oluştu');
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
          rules={[{ required: true, message: 'Lütfen kategori adını girin!' }]}
        >
          <Input placeholder="Kategori adını girin" />
        </Form.Item>

        <Form.Item
          label="Görsel URL"
          name="image"
          rules={[{ required: true, message: 'Lütfen geçerli bir URL girin!' }]}
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
